import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LegalSections } from '../../shared/components/legal-sections/legal-sections';
import {
  CGU_SECTION_KEYS,
  CGV_SECTION_KEYS,
  MENTIONS_LEGALES_SECTION_KEYS,
} from '../../shared/components/legal-modal/legal-modal.content';
import {
  ANNULATION_SECTION_KEYS,
  CONFIDENTIALITE_SECTION_KEYS,
  COOKIES_SECTION_KEYS,
} from '../../shared/components/policy-modal/policy-modal.content';

type LegalDoc = 'cgu' | 'cgv' | 'mentionsLegales' | 'confidentialite' | 'cookies' | 'annulation';

const LEGAL_DOC_CONTENT: Record<LegalDoc, { titleKey: string; keys: string[] }> = {
  cgu: { titleKey: 'legal.cgu.title', keys: CGU_SECTION_KEYS },
  cgv: { titleKey: 'legal.cgv.title', keys: CGV_SECTION_KEYS },
  mentionsLegales: { titleKey: 'legal.mentionsLegales.title', keys: MENTIONS_LEGALES_SECTION_KEYS },
  confidentialite: { titleKey: 'policy.confidentialite.title', keys: CONFIDENTIALITE_SECTION_KEYS },
  cookies: { titleKey: 'policy.cookies.title', keys: COOKIES_SECTION_KEYS },
  annulation: { titleKey: 'policy.annulation.title', keys: ANNULATION_SECTION_KEYS },
};

/** Page routée (préchargée en SSG) partagée par les 5 documents légaux — seule la liste de
 * sections i18n change d'un document à l'autre (cf. `data.legalDoc` sur la route, déclaré dans
 * app.routes.ts). Le contenu est partagé avec les modales legal-modal/policy-modal. */
@Component({
  standalone: true,
  imports: [TranslocoModule, LegalSections],
  templateUrl: './legal-placeholder.html',
})
export class LegalPlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  private readonly doc = (this.route.snapshot.data['legalDoc'] as LegalDoc) ?? 'mentionsLegales';
  protected readonly content = LEGAL_DOC_CONTENT[this.doc];
}
