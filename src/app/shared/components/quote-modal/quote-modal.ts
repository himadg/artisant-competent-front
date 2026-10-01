import {
  Component,
  ChangeDetectionStrategy,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { QuoteService } from '../../../core/services/quote.service';
import { DemandService } from '../../../core/services/demand.service';
import { DashboardDataService } from '../../../core/services/dashboard-data.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import {
  MaterialOrigin,
  Quote,
  QuoteDocument,
  QuoteDocumentDraft,
  QuoteLineItem,
  QuoteMaterialLineItem,
  QuotePreviewData,
  SaveQuoteDraftPayload,
} from '../../interfaces/quote';
import { ProfessionalDashboardData, ProfessionalProfile } from '../../interfaces/professional-dashboard';
import { DemandDetail } from '../../interfaces/demand';
import { QuotePreview } from '../quote-preview/quote-preview';
import { YoutrustSignatureWidget } from '../youtrust-signature-widget/youtrust-signature-widget';

// Discriminant purement interne (routage vers le bon signal dans linesSignal()) — ce n'est pas une
// forme de donnée, donc pas dans shared/interfaces/ contrairement à QuoteLineItem/QuoteDocumentDraft.
type LineCategory = 'material' | 'labor' | 'logistics';

function emptyLine(): QuoteLineItem {
  return { description: '', amountHT: null, vatRate: 20 };
}

// amountHT des lignes de matériaux : calculé, jamais saisi à la main (contrairement à la
// main-d'œuvre/logistique) — null tant que quantité et prix unitaire ne sont pas tous les deux renseignés.
function computeMaterialAmount(quantity: number | null, unitPriceHT: number | null): number | null {
  return quantity !== null && unitPriceHT !== null ? quantity * unitPriceHT : null;
}

function emptyMaterialLine(): QuoteMaterialLineItem {
  const defaultQuantity = 1;
  const defaultUnitPriceHT = 0;
  return {
    ...emptyLine(),
    materialOrigin: [],
    quantity: defaultQuantity,
    unitPriceHT: defaultUnitPriceHT,
    amountHT: computeMaterialAmount(defaultQuantity, defaultUnitPriceHT),
  };
}

function emptyDocument(): QuoteDocumentDraft {
  return { name: '', fileKey: null, file: null, fileName: null };
}

// Durée de validité par défaut d'un nouveau devis : pas de minimum/maximum légal, 90 jours est
// l'usage courant du secteur — ajustable ensuite par le pro.
function defaultValidUntil(): string {
  const date = new Date();
  date.setDate(date.getDate() + 90);
  return date.toLocaleDateString('en-CA');
}

// Numéro de devis non modifiable par le pro : généré une seule fois, à la création d'un nouveau
// devis (pas de brouillon existant) — jamais régénéré aux ouvertures suivantes de la même demande.
function generateQuoteNumber(): string {
  const year = new Date().getFullYear();

  // [100_000, 999_999] plutôt que [0, 999_999] : un vrai nombre à 6 chiffres n'a jamais de zéro en
  // tête par définition (ex: "042135" n'existe pas ici) — élimine complètement le risque, sans avoir
  // à le rendre juste "rare", et supprime au passage tout risque de perte de zéro si le numéro était
  // un jour reconverti en Number() (rien à perdre, le premier chiffre n'est jamais 0).
  const min = 100_000;
  const range = 900_000; // 999_999 - 100_000 + 1

  // Rejet (rejection sampling) : sans lui, `% range` favoriserait très légèrement les petites valeurs
  // (2^32 n'est pas un multiple exact de 900_000) — négligeable pour un simple identifiant affiché,
  // mais on l'élimine complètement puisqu'on est dans une implémentation stricte.
  const maxUint32 = 2 ** 32;
  const rejectionLimit = maxUint32 - (maxUint32 % range);
  let raw: number;
  do {
    raw = crypto.getRandomValues(new Uint32Array(1))[0];
  } while (raw >= rejectionLimit);

  return `DV-${year}-${min + (raw % range)}`;
}

@Component({
  selector: 'quote-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, DecimalPipe, QuotePreview, YoutrustSignatureWidget],
  templateUrl: './quote-modal.html',
  styleUrl: './quote-modal.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuoteModal implements OnInit {
  private readonly quoteService = inject(QuoteService);
  private readonly demandService = inject(DemandService);
  private readonly dashboardData = inject(DashboardDataService);
  private readonly flash = inject(FlashMessageService);

  readonly demandId = input.required<string>();
  readonly closed = output<void>();

  readonly quoteNumber = signal('');
  readonly validUntil = signal('');

  readonly today = new Date().toLocaleDateString('en-CA');

  readonly loadingDraft = signal(true);
  readonly saving = signal(false);
  readonly sending = signal(false);

  // ── Validation à l'envoi ─────────────────────────────────────────────────
  // Passe à true seulement après un envoi refusé pour champs manquants (cf. sendQuote) : les
  // astérisques restent affichés en permanence, mais les bordures rouges n'apparaissent qu'après
  // une tentative d'envoi ratée — comme le formulaire d'inscription pro.
  readonly attemptedSend = signal(false);

  readonly laborIncomplete = computed(
    () => !this.laborLines().some((l) => l.description.trim() !== '' && l.amountHT !== null),
  );
  readonly nightWorkSurchargeMissing = computed(() => this.nightWorkSurcharge() === null);
  readonly estimatedStartDateMissing = computed(() => !this.estimatedStartDate());
  readonly estimatedEndDateMissing = computed(() => !this.estimatedEndDate());
  readonly validUntilMissing = computed(() => !this.validUntil());
  readonly documentsMissing = computed(
    () => !this.documents().some((d) => d.name.trim() !== '' && (d.fileKey !== null || d.file !== null)),
  );
  readonly decennaleInsurerMissing = computed(() => !this.decennaleInsurer().trim());
  readonly decennalePolicyNumberMissing = computed(() => !this.decennalePolicyNumber().trim());
  readonly rcProInsurerMissing = computed(() => !this.rcProInsurer().trim());
  readonly rcProPolicyNumberMissing = computed(() => !this.rcProPolicyNumber().trim());

  // Une ligne de matériaux jamais touchée par le pro (le formulaire en garde toujours une par
  // défaut) ne doit pas être signalée comme incomplète — seule une ligne réellement commencée
  // (description ou origine renseignée) doit l'être si elle ne l'est pas entièrement.
  isMaterialLineBlank(line: QuoteMaterialLineItem): boolean {
    return line.description.trim() === '' && !line.materialOrigin?.length;
  }

  materialLineInvalid(line: QuoteMaterialLineItem): boolean {
    if (this.isMaterialLineBlank(line)) return false;
    return line.description.trim() === '' || line.amountHT === null || !line.materialOrigin?.length;
  }

  // ── Aperçu (identité pro/client, chargées séparément du brouillon) ─────
  private readonly professionalProfile = signal<ProfessionalProfile | null>(null);
  private readonly demand = signal<DemandDetail | null>(null);
  readonly showPreview = signal(false);

  readonly previewData = computed<QuotePreviewData | null>(() => {
    const professional = this.professionalProfile();
    const demand = this.demand();
    if (!professional || !demand) return null;
    return {
      quoteNumber: this.quoteNumber(),
      createdAt: this.today,
      validUntil: this.validUntil() || null,
      professional: {
        companyName: professional.companyName,
        siret: professional.siret,
        legalForm: professional.legalForm,
        managerPhone: professional.managerPhone,
        professionalEmail: professional.professionalEmail,
        logoUrl: professional.logoUrl,
        workAddress: professional.workAddress,
      },
      client: {
        firstName: demand.author.firstName,
        lastName: demand.author.lastName,
        address: demand.address,
      },
      materialLines: this.noMaterials() ? [] : this.materialLines(),
      laborLines: this.laborLines(),
      logisticsLines: this.logisticsLines(),
      nightWorkSurcharge: this.nightWorkSurcharge(),
      estimatedStartDate: this.estimatedStartDate() || null,
      estimatedEndDate: this.estimatedEndDate() || null,
      documents: this.documents()
        .filter((d) => d.name.trim())
        .map((d) => ({ name: d.name })),
      remarks: this.remarks(),
      decennaleInsurer: this.decennaleInsurer(),
      decennalePolicyNumber: this.decennalePolicyNumber(),
      decennaleCoverageArea: this.decennaleCoverageArea(),
      rcProInsurer: this.rcProInsurer(),
      rcProPolicyNumber: this.rcProPolicyNumber(),
      klarnaAccepted: this.klarnaAccepted(),
      vatExempt: this.vatExempt(),
    };
  });

  openPreview(): void {
    if (this.previewData()) this.showPreview.set(true);
  }

  // ── 1. Matériaux et fournitures ─────────────────────────────────────────
  readonly materialLines = signal<QuoteMaterialLineItem[]>([emptyMaterialLine()]);

  // Déclaration globale (pas une origine par ligne) : quand elle est cochée, toute la section
  // matériaux/fournitures est masquée (cf. quote-modal.html) et envoyée comme une liste vide, jamais
  // requise (cf. buildDraftPayload) — au rechargement, une liste vide ne peut provenir que de là
  // puisque le formulaire garde toujours au moins une ligne par défaut sinon (cf. applyDraft).
  readonly noMaterials = signal(false);

  toggleNoMaterials(): void {
    this.noMaterials.update((v) => !v);
  }

  addMaterialLine(): void {
    this.materialLines.update((list) => [...list, emptyMaterialLine()]);
  }

  removeMaterialLine(index: number): void {
    this.materialLines.update((list) => list.filter((_, i) => i !== index));
  }

  toggleMaterialOrigin(index: number, origin: MaterialOrigin): void {
    this.materialLines.update((list) =>
      list.map((line, i) => {
        if (i !== index) return line;
        const current = line.materialOrigin ?? [];
        const has = current.includes(origin);
        return { ...line, materialOrigin: has ? current.filter((o) => o !== origin) : [...current, origin] };
      }),
    );
  }

  isMaterialOriginChecked(index: number, origin: MaterialOrigin): boolean {
    return this.materialLines()[index]?.materialOrigin?.includes(origin) ?? false;
  }

  updateMaterialLineQuantity(index: number, value: string): void {
    const quantity = value === '' ? null : Number(value);
    this.materialLines.update((list) =>
      list.map((line, i) =>
        i === index ? { ...line, quantity, amountHT: computeMaterialAmount(quantity, line.unitPriceHT) } : line,
      ),
    );
  }

  updateMaterialLineUnitPrice(index: number, value: string): void {
    const unitPriceHT = value === '' ? null : Number(value);
    this.materialLines.update((list) =>
      list.map((line, i) =>
        i === index ? { ...line, unitPriceHT, amountHT: computeMaterialAmount(line.quantity, unitPriceHT) } : line,
      ),
    );
  }

  // ── 2. Prestation (main-d'œuvre) ────────────────────────────────────────
  readonly laborLines = signal<QuoteLineItem[]>([emptyLine()]);
  readonly nightWorkSurcharge = signal<boolean | null>(null);

  addLaborLine(): void {
    this.laborLines.update((list) => [...list, emptyLine()]);
  }

  removeLaborLine(index: number): void {
    this.laborLines.update((list) => list.filter((_, i) => i !== index));
  }

  // ── 3. Logistique et frais annexes ──────────────────────────────────────
  readonly logisticsLines = signal<QuoteLineItem[]>([emptyLine()]);

  addLogisticsLine(): void {
    this.logisticsLines.update((list) => [...list, emptyLine()]);
  }

  removeLogisticsLine(index: number): void {
    this.logisticsLines.update((list) => list.filter((_, i) => i !== index));
  }

  // ── Champs communs aux 3 catégories de lignes ───────────────────────────
  updateLineDescription(category: LineCategory, index: number, value: string): void {
    this.linesSignal(category).update((list) =>
      list.map((line, i) => (i === index ? { ...line, description: value } : line)),
    );
  }

  updateLineAmount(category: LineCategory, index: number, value: string): void {
    const amountHT = value === '' ? null : Number(value);
    this.linesSignal(category).update((list) => list.map((line, i) => (i === index ? { ...line, amountHT } : line)));
  }

  updateLineVatRate(category: LineCategory, index: number, value: string): void {
    const vatRate = Number(value);
    this.linesSignal(category).update((list) => list.map((line, i) => (i === index ? { ...line, vatRate } : line)));
  }

  lineTTC(line: QuoteLineItem): number {
    const ht = line.amountHT ?? 0;
    if (this.vatExempt()) return ht;
    return ht + (ht * line.vatRate) / 100;
  }

  private linesSignal(category: LineCategory) {
    switch (category) {
      case 'material':
        return this.materialLines;
      case 'labor':
        return this.laborLines;
      case 'logistics':
        return this.logisticsLines;
    }
  }

  // ── 4. Dates prévisionnelles ─────────────────────────────────────────────
  readonly estimatedStartDate = signal('');
  readonly estimatedEndDate = signal('');

  // ── 5. Mentions et obligations légales ──────────────────────────────────
  readonly documents = signal<QuoteDocumentDraft[]>([emptyDocument()]);

  // Documents déjà sauvegardés (fileKey connu) : envoyés tels quels dans `documents` du payload.
  private readonly existingDocuments = computed<QuoteDocument[]>(() =>
    this.documents()
      .filter((d): d is QuoteDocumentDraft & { fileKey: string } => d.name.trim() !== '' && d.fileKey !== null)
      .map((d) => ({ name: d.name, fileKey: d.fileKey })),
  );

  // Fichiers tout juste sélectionnés, jamais encore uploadés : envoyés séparément à l'enregistrement/
  // l'envoi (cf. QuoteService.saveDraft), uploadés dans cette même requête, pas à la sélection.
  private readonly newDocuments = computed<{ name: string; file: File }[]>(() =>
    this.documents()
      .filter((d): d is QuoteDocumentDraft & { file: File } => d.name.trim() !== '' && d.fileKey === null && d.file !== null)
      .map((d) => ({ name: d.name, file: d.file })),
  );

  // Références d'assurance saisies pour ce devis (pas sur ProfessionalProfile).
  readonly decennaleInsurer = signal('');
  readonly decennalePolicyNumber = signal('');
  readonly decennaleCoverageArea = signal('');
  readonly rcProInsurer = signal('');
  readonly rcProPolicyNumber = signal('');
  readonly klarnaAccepted = signal(false);
  readonly vatExempt = signal(false);

  addDocument(): void {
    this.documents.update((list) => [...list, emptyDocument()]);
  }

  removeDocument(index: number): void {
    this.documents.update((list) => list.filter((_, i) => i !== index));
  }

  // Le fichier reste local : il n'est uploadé qu'au moment d'enregistrer/envoyer le devis, dans la
  // même requête que le reste du formulaire (cf. QuoteService.saveDraft).
  onDocumentFileChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    this.documents.update((list) =>
      list.map((doc, i) => (i === index ? { ...doc, file, fileName: file.name, fileKey: null } : doc)),
    );
  }

  updateDocumentName(index: number, value: string): void {
    this.documents.update((list) => list.map((doc, i) => (i === index ? { ...doc, name: value } : doc)));
  }

  // ── 6. Remarque ───────────────────────────────────────────────────────
  readonly remarks = signal('');

  // ── Récapitulatif ────────────────────────────────────────────────────
  // "Aucun matériel" exclut les lignes de matériaux du total, comme du payload envoyé au serveur
  // (cf. buildDraftPayload) — sinon les montants déjà saisis avant de cocher la case resteraient
  // comptés ici alors qu'ils ne seront jamais envoyés.
  private readonly allLines = computed(() => [
    ...(this.noMaterials() ? [] : this.materialLines()),
    ...this.laborLines(),
    ...this.logisticsLines(),
  ]);

  readonly totalHT = computed(() => this.allLines().reduce((sum, l) => sum + (l.amountHT ?? 0), 0));
  readonly totalVAT = computed(() =>
    this.vatExempt() ? 0 : this.allLines().reduce((sum, l) => sum + ((l.amountHT ?? 0) * l.vatRate) / 100, 0),
  );
  readonly totalTTC = computed(() => this.totalHT() + this.totalVAT());

  ngOnInit(): void {
    // `demandId` est un input required : une nouvelle instance de QuoteModal est créée à chaque
    // ouverture (cf. @if dans messaging.html), donc un chargement unique ici suffit — pas besoin
    // d'observer un changement de demandId en cours de vie du composant.
    this.quoteService
      .getDraft(this.demandId())
      .then((draft) => {
        if (draft?.status === 'DRAFT') {
          this.applyDraft(draft);
        } else if (draft?.status === 'DECLINED') {
          // Pas de brouillon actif : le backend renvoie le dernier devis refusé comme modèle à
          // dupliquer (documents déjà copiés vers de nouvelles clés côté serveur) — on reprend son
          // contenu mais jamais son numéro ni sa date de validité, qui doivent être neufs.
          this.applyDraft(draft);
          this.quoteNumber.set(generateQuoteNumber());
          this.validUntil.set(defaultValidUntil());
          this.flash.set({ type: 'info', key: 'quote.actions.prefilledFromDeclined' });
        } else {
          this.quoteNumber.set(generateQuoteNumber());
          this.validUntil.set(defaultValidUntil());
        }
      })
      .catch(() => this.flash.set({ type: 'error', key: 'errors.unknown' }))
      .finally(() => this.loadingDraft.set(false));

    // Chargement séparé de l'aperçu : `loadOwn` est mis en cache par DashboardDataService, donc
    // gratuit si le dashboard pro l'a déjà chargé — n'attend pas et ne bloque pas le brouillon.
    Promise.all([this.dashboardData.loadOwn<ProfessionalDashboardData>(), this.demandService.getById(this.demandId())])
      .then(([dashboard, demand]) => {
        this.professionalProfile.set(dashboard.professionalProfile);
        this.demand.set(demand);
      })
      .catch(() => this.flash.set({ type: 'error', key: 'errors.unknown' }));
  }

  private applyDraft(draft: Quote): void {
    this.quoteNumber.set(draft.quoteNumber);
    this.validUntil.set(draft.validUntil?.slice(0, 10) ?? defaultValidUntil());
    // Une liste vide ne peut provenir que d'un envoi précédent avec "aucun matériel" coché (le
    // formulaire garde toujours au moins une ligne par défaut sinon, cf. emptyMaterialLine).
    this.noMaterials.set(draft.materialLines.length === 0);
    this.materialLines.set(draft.materialLines.length ? draft.materialLines : [emptyMaterialLine()]);
    this.laborLines.set(draft.laborLines.length ? draft.laborLines : [emptyLine()]);
    this.logisticsLines.set(draft.logisticsLines.length ? draft.logisticsLines : [emptyLine()]);
    this.nightWorkSurcharge.set(draft.nightWorkSurcharge);
    this.estimatedStartDate.set(draft.estimatedStartDate?.slice(0, 10) ?? '');
    this.estimatedEndDate.set(draft.estimatedEndDate?.slice(0, 10) ?? '');
    this.documents.set(
      draft.documents.length
        ? draft.documents.map((d) => ({ name: d.name, fileKey: d.fileKey, file: null, fileName: d.name }))
        : [emptyDocument()],
    );
    this.remarks.set(draft.remarks ?? '');
    this.decennaleInsurer.set(draft.decennaleInsurer ?? '');
    this.decennalePolicyNumber.set(draft.decennalePolicyNumber ?? '');
    this.decennaleCoverageArea.set(draft.decennaleCoverageArea ?? '');
    this.rcProInsurer.set(draft.rcProInsurer ?? '');
    this.rcProPolicyNumber.set(draft.rcProPolicyNumber ?? '');
    this.klarnaAccepted.set(draft.klarnaAccepted);
    this.vatExempt.set(draft.vatExempt);
  }

  private buildDraftPayload(): SaveQuoteDraftPayload {
    return {
      quoteNumber: this.quoteNumber(),
      validUntil: this.validUntil() || null,
      materialLines: this.noMaterials() ? [] : this.materialLines(),
      laborLines: this.laborLines(),
      logisticsLines: this.logisticsLines(),
      nightWorkSurcharge: this.nightWorkSurcharge(),
      estimatedStartDate: this.estimatedStartDate() || null,
      estimatedEndDate: this.estimatedEndDate() || null,
      documents: this.existingDocuments(),
      remarks: this.remarks(),
      decennaleInsurer: this.decennaleInsurer(),
      decennalePolicyNumber: this.decennalePolicyNumber(),
      decennaleCoverageArea: this.decennaleCoverageArea(),
      rcProInsurer: this.rcProInsurer(),
      rcProPolicyNumber: this.rcProPolicyNumber(),
      klarnaAccepted: this.klarnaAccepted(),
      vatExempt: this.vatExempt(),
      // Consentements du client (signature électronique à venir) : le pro n'y a jamais accès,
      // toujours false tant que le client n'a pas lui-même signé le devis dans son propre écran.
      quoteAgreementAccepted: false,
      earlyStartAccepted: false,
    };
  }

  // Utilisé par saveDraft() ET sendQuote() (celui-ci doit persister l'état courant du formulaire
  // avant de demander l'envoi, puisque le serveur valide le devis TEL QUE PERSISTÉ, pas un nouveau
  // payload) — resynchronise `documents` avec les fileKey réels pour ne jamais ré-uploader deux fois.
  private persistDraft(): Promise<Quote> {
    return this.quoteService.saveDraft(this.demandId(), this.buildDraftPayload(), this.newDocuments()).then((quote) => {
      this.documents.set(
        quote.documents.length
          ? quote.documents.map((d) => ({ name: d.name, fileKey: d.fileKey, file: null, fileName: d.name }))
          : [emptyDocument()],
      );
      return quote;
    });
  }

  // Le backend ne renvoie jamais de texte à afficher, seulement un `code` — la traduction vient
  // toujours d'ici (fr.json/en.json), jamais de err.error.message (même convention que
  // DEMAND_ADDRESS_NOT_FOUND ailleurs dans l'app).
  private static readonly ERROR_CODE_KEYS: Record<string, string> = {
    QUOTE_PENDING_CLIENT_RESPONSE: 'quote.actions.pendingClientResponse',
    QUOTE_ALREADY_ACCEPTED: 'quote.actions.alreadyAccepted',
    QUOTE_ALREADY_SENT: 'quote.actions.alreadySent',
  };

  private errorFlashKey(err: unknown): string {
    const code = (err as { error?: { code?: string } })?.error?.code;
    return (code && QuoteModal.ERROR_CODE_KEYS[code]) || 'errors.unknown';
  }

  saveDraft(): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.persistDraft()
      .then(() => this.flash.set({ type: 'success', key: 'quote.actions.draftSaveSuccess' }))
      .catch((err: unknown) => this.flash.set({ type: 'error', key: this.errorFlashKey(err) }))
      .finally(() => this.saving.set(false));
  }

  // Rempli une fois la Signature Request YouTrust créée : affiche le widget de signature du pro
  // (cf. quote-modal.html) — le devis ne passe réellement en SENT qu'une fois cette signature
  // confirmée côté serveur par webhook (cf. onProSigned), jamais directement à la réponse de send().
  readonly signatureLink = signal<string | null>(null);
  readonly isSandbox = signal(false);

  sendQuote(): void {
    if (this.saving() || this.sending()) return;
    this.sending.set(true);
    this.persistDraft()
      .then(() => this.quoteService.send(this.demandId()))
      .then(({ signatureLink, isSandbox }) => {
        if (!signatureLink) {
          this.flash.set({ type: 'error', key: 'errors.unknown' });
          return;
        }
        this.signatureLink.set(signatureLink);
        this.isSandbox.set(isSandbox);
      })
      .catch((err: unknown) => {
        const hasFieldErrors = !!(err as { error?: { errors?: unknown[] } })?.error?.errors;
        if (hasFieldErrors) this.attemptedSend.set(true);
        this.flash.set({
          type: 'error',
          key: hasFieldErrors ? 'quote.actions.sendMissingFields' : this.errorFlashKey(err),
        });
      })
      .finally(() => this.sending.set(false));
  }

  // Signature du pro confirmée côté widget YouTrust (cf. YoutrustSignatureWidget.success) — la
  // bascule réelle en SENT + l'envoi du message dans la conversation se font côté serveur via
  // webhook, on ferme simplement le formulaire ici.
  onProSigned(): void {
    this.signatureLink.set(null);
    this.flash.set({ type: 'success', key: 'quote.actions.sendSuccess' });
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
