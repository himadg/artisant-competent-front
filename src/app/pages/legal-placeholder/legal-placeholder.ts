import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

/**
 * Page placeholder partagée par les 5 routes légales (CGU, CGV, mentions légales,
 * politique de confidentialité, politique de cookies). Le titre h1 est lu depuis
 * le `title` Transloco déclaré dans la route correspondante.
 *
 * TODO_HIMAD: remplacer le contenu placeholder de chaque page par le texte officiel
 * lorsque les versions définitives seront fournies.
 */
@Component({
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './legal-placeholder.html',
})
export class LegalPlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly titleKey = this.route.snapshot.title ?? '';
}
