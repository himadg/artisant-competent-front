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
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { MaterialOrigin, Quote, QuoteDocumentDraft, QuoteLineItem, SaveQuoteDraftPayload } from '../../interfaces/quote';

// Discriminant purement interne (routage vers le bon signal dans linesSignal()) — ce n'est pas une
// forme de donnée, donc pas dans shared/interfaces/ contrairement à QuoteLineItem/QuoteDocumentDraft.
type LineCategory = 'material' | 'labor' | 'logistics';

function emptyLine(): QuoteLineItem {
  return { description: '', amountHT: null, vatRate: 20 };
}

function emptyMaterialLine(): QuoteLineItem {
  return { ...emptyLine(), materialOrigin: [] };
}

function emptyDocument(): QuoteDocumentDraft {
  return { file: null, fileName: null, name: '' };
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
  imports: [TranslocoModule, DecimalPipe],
  templateUrl: './quote-modal.html',
  styleUrl: './quote-modal.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class QuoteModal implements OnInit {
  private readonly quoteService = inject(QuoteService);
  private readonly flash = inject(FlashMessageService);

  readonly demandId = input.required<string>();
  readonly closed = output<void>();

  readonly quoteNumber = signal('');

  readonly today = new Date().toLocaleDateString('en-CA');

  readonly loadingDraft = signal(true);
  readonly saving = signal(false);

  // ── 1. Matériaux et fournitures ─────────────────────────────────────────
  readonly materialLines = signal<QuoteLineItem[]>([emptyMaterialLine()]);

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
        // "Aucun matériel" est exclusif des 3 autres choix.
        if (origin === 'none') {
          return { ...line, materialOrigin: has ? [] : ['none'] };
        }
        const withoutNone = current.filter((o) => o !== 'none');
        return {
          ...line,
          materialOrigin: has ? withoutNone.filter((o) => o !== origin) : [...withoutNone, origin],
        };
      }),
    );
  }

  isMaterialOriginChecked(index: number, origin: MaterialOrigin): boolean {
    return this.materialLines()[index]?.materialOrigin?.includes(origin) ?? false;
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
  readonly klarnaAccepted = signal(false);
  readonly vatExempt = signal(false);

  addDocument(): void {
    this.documents.update((list) => [...list, emptyDocument()]);
  }

  removeDocument(index: number): void {
    this.documents.update((list) => list.filter((_, i) => i !== index));
  }

  onDocumentFileChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.documents.update((list) =>
      list.map((doc, i) => (i === index ? { ...doc, file, fileName: file?.name ?? null } : doc)),
    );
  }

  updateDocumentName(index: number, value: string): void {
    this.documents.update((list) => list.map((doc, i) => (i === index ? { ...doc, name: value } : doc)));
  }

  // ── 6. Remarque ───────────────────────────────────────────────────────
  readonly remarks = signal('');

  // ── 7. Accord et validation ──────────────────────────────────────────
  readonly quoteAgreementAccepted = signal(false);
  readonly earlyStartAccepted = signal(false);

  // ── Récapitulatif ────────────────────────────────────────────────────
  private readonly allLines = computed(() => [...this.materialLines(), ...this.laborLines(), ...this.logisticsLines()]);

  readonly totalHT = computed(() => this.allLines().reduce((sum, l) => sum + (l.amountHT ?? 0), 0));
  readonly totalVAT = computed(() =>
    this.allLines().reduce((sum, l) => sum + ((l.amountHT ?? 0) * l.vatRate) / 100, 0),
  );
  readonly totalTTC = computed(() => this.totalHT() + this.totalVAT());

  ngOnInit(): void {
    // `demandId` est un input required : une nouvelle instance de QuoteModal est créée à chaque
    // ouverture (cf. @if dans messaging.html), donc un chargement unique ici suffit — pas besoin
    // d'observer un changement de demandId en cours de vie du composant.
    this.quoteService
      .getDraft(this.demandId())
      .then((draft) => {
        if (draft) {
          this.applyDraft(draft);
        } else {
          this.quoteNumber.set(generateQuoteNumber());
        }
      })
      .catch(() => this.flash.set({ type: 'error', key: 'errors.unknown' }))
      .finally(() => this.loadingDraft.set(false));
  }

  private applyDraft(draft: Quote): void {
    this.quoteNumber.set(draft.quoteNumber);
    this.materialLines.set(draft.materialLines.length ? draft.materialLines : [emptyMaterialLine()]);
    this.laborLines.set(draft.laborLines.length ? draft.laborLines : [emptyLine()]);
    this.logisticsLines.set(draft.logisticsLines.length ? draft.logisticsLines : [emptyLine()]);
    this.nightWorkSurcharge.set(draft.nightWorkSurcharge);
    this.estimatedStartDate.set(draft.estimatedStartDate?.slice(0, 10) ?? '');
    this.estimatedEndDate.set(draft.estimatedEndDate?.slice(0, 10) ?? '');
    this.documents.set(
      draft.documents.length
        ? draft.documents.map((d) => ({ file: null, fileName: null, name: d.name }))
        : [emptyDocument()],
    );
    this.remarks.set(draft.remarks ?? '');
    this.klarnaAccepted.set(draft.klarnaAccepted);
    this.vatExempt.set(draft.vatExempt);
    this.quoteAgreementAccepted.set(draft.quoteAgreementAccepted);
    this.earlyStartAccepted.set(draft.earlyStartAccepted);
  }

  private buildDraftPayload(): SaveQuoteDraftPayload {
    return {
      quoteNumber: this.quoteNumber(),
      materialLines: this.materialLines(),
      laborLines: this.laborLines(),
      logisticsLines: this.logisticsLines(),
      nightWorkSurcharge: this.nightWorkSurcharge(),
      estimatedStartDate: this.estimatedStartDate() || null,
      estimatedEndDate: this.estimatedEndDate() || null,
      documents: this.documents()
        .filter((d) => d.name.trim())
        .map((d) => ({ name: d.name })),
      remarks: this.remarks(),
      klarnaAccepted: this.klarnaAccepted(),
      vatExempt: this.vatExempt(),
      quoteAgreementAccepted: this.quoteAgreementAccepted(),
      earlyStartAccepted: this.earlyStartAccepted(),
    };
  }

  saveDraft(): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.quoteService
      .saveDraft(this.demandId(), this.buildDraftPayload())
      .then(() => this.flash.set({ type: 'success', key: 'quote.actions.draftSaveSuccess' }))
      .catch(() => this.flash.set({ type: 'error', key: 'errors.unknown' }))
      .finally(() => this.saving.set(false));
  }

  close(): void {
    this.closed.emit();
  }
}
