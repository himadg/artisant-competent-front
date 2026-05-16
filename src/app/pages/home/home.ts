import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SearchPro } from '../../shared/components/search-pro/search-pro';

@Component({
  standalone: true,
  imports: [TranslocoModule, RouterModule, SearchPro],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage implements OnInit {
  /**
   * Section "Preuve sociale" masquée tant qu'il n'y a pas au moins 3 avis réels.
   * Passer à true une fois les avis réels disponibles (section 7 du brief V5).
   */
  readonly reviewsEnabled = false;

  private readonly meta = inject(Meta);
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  ngOnInit(): void {
    const url = 'https://artisan-competent.com/';

    this.transloco
      .selectTranslate<string[]>(['home.meta.title', 'home.meta.ogDescription', 'home.meta.description'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([title, ogDescription, description]) => {
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: ogDescription });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'og:url', content: url });
        // TODO: og:image 1200x630 à fournir
      });

    this.setCanonicalUrl(url);
  }

  private setCanonicalUrl(url: string): void {
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
