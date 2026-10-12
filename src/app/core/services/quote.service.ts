import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Quote, QuoteViewerData, SaveQuoteDraftPayload, SignatureLinkResult } from '../../shared/interfaces/quote';
import { LangService } from './lang.service';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly http = inject(HttpClient);
  private readonly langService = inject(LangService);

  /** Upsert : un seul brouillon actif par pro et par demande, sauvegarder met toujours à jour le même.
   * `newDocuments` : fichiers sélectionnés depuis la dernière sauvegarde (jamais encore uploadés) —
   * uploadés dans cette même requête, tout-ou-rien avec le reste du devis (cf. QuoteService backend). */
  saveDraft(demandId: string, payload: SaveQuoteDraftPayload, newDocuments: { name: string; file: File }[]): Promise<Quote> {
    const form = new FormData();
    form.append('data', JSON.stringify({ ...payload, newDocumentNames: newDocuments.map((d) => d.name) }));
    for (const { file } of newDocuments) form.append('files', file);

    return firstValueFrom(this.http.put<Quote>(`/demands/${demandId}/quote`, form));
  }

  /** `null` si aucun brouillon n'existe encore pour cette demande. */
  getDraft(demandId: string): Promise<Quote | null> {
    return firstValueFrom(this.http.get<Quote | null>(`/demands/${demandId}/quote`));
  }

  /** Valide le devis tel qu'enregistré côté serveur et crée la Signature Request YouTrust (pro puis
   * client) — renvoie le lien de signature du pro, à afficher dans le widget embarqué. Le devis ne
   * passe en SIGNED_BY_PRO (et le message n'est envoyé dans la conversation) qu'une fois cette
   * signature confirmée par webhook, jamais directement en réponse de cet appel.
   * `lang` : langue ACTIVE du pro au moment de l'envoi (jamais stockée), pour l'écran de signature
   * YouTrust — cf. LangService. */
  send(demandId: string): Promise<SignatureLinkResult> {
    return firstValueFrom(
      this.http.post<SignatureLinkResult>(`/demands/${demandId}/quote/send`, { lang: this.langService.lang() }),
    );
  }

  /** Lecture par un viewer qui n'est pas le pro propriétaire (client, cmod plus tard) — identifié
   * par le devis précis (`quoteId`, connu via le message qui l'a annoncé), jamais "le devis
   * courant" d'une conversation. Un devis encore en brouillon n'est jamais renvoyé à ce viewer. */
  getForViewer(quoteId: string): Promise<QuoteViewerData> {
    return firstValueFrom(this.http.get<QuoteViewerData>(`/quotes/${quoteId}`));
  }

  /** URL signée temporaire vers le PDF final (signé par les 2 parties) — générée à la demande, pas
   * pré-chargée avec `getForViewer` (inutile de fabriquer une URL si personne ne clique jamais). */
  getSignedPdfUrl(quoteId: string): Promise<{ url: string }> {
    return firstValueFrom(this.http.get<{ url: string }>(`/quotes/${quoteId}/signed-pdf-url`));
  }

  /** Appelée par le même bouton pour la 1ère tentative ou une reprise (widget fermé avant la fin) —
   * jamais de paiement ici : le paiement (mocké pour l'instant) n'est déclenché côté serveur qu'une
   * fois la signature du client confirmée par webhook, jamais avant (cf. QuoteService backend —
   * l'acompte se paie à la signature, pas avant). `null` tant que le pro n'a pas encore signé (ordre
   * séquentiel imposé par YouTrust). `lang` : sa langue active à cet instant précis (jamais stockée),
   * appliquée à chaque appel pour rester toujours à jour. */
  requestClientSignature(quoteId: string): Promise<SignatureLinkResult> {
    return firstValueFrom(
      this.http.post<SignatureLinkResult>(`/quotes/${quoteId}/sign`, { lang: this.langService.lang() }),
    );
  }

  /** Refus du client — n'invoque jamais YouTrust (cf. discussion : décliner ne signe rien). */
  decline(quoteId: string): Promise<Quote> {
    return firstValueFrom(this.http.post<Quote>(`/quotes/${quoteId}/decline`, {}));
  }

  /** Appelée une fois le paiement (mocké pour l'instant, widget/iframe Stripe Connect à câbler plus
   * tard) terminé côté client — PENDING_PAYMENT -> PAID. Contrairement aux étapes de signature,
   * c'est un appel REST classique en réponse directe à une action du client, pas un webhook. */
  confirmPayment(quoteId: string): Promise<void> {
    return firstValueFrom(this.http.post<void>(`/quotes/${quoteId}/confirm-payment`, {}));
  }

  /** Réservé à la route d'impression (`/print/quote/:quoteId`) : l'autorisation vient du jeton posé
   * par Playwright en en-tête (X-Print-Token), jamais d'une session utilisateur — cet appel n'a donc
   * de sens que chargé par le navigateur headless de génération PDF, jamais par un vrai utilisateur. */
  getPrintData(quoteId: string): Promise<QuoteViewerData> {
    return firstValueFrom(this.http.get<QuoteViewerData>(`/print/quotes/${quoteId}`));
  }
}
