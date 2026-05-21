import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { KlarnaFaqService } from '../../services/klarna-faq.service';

@Component({
  selector: 'ac-announcement-banner',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './announcement-banner.html',
  styleUrl: './announcement-banner.scss',
})
export class AnnouncementBanner {
  private readonly router = inject(Router);
  private readonly klarnaFaq = inject(KlarnaFaqService);

  /**
   * Navigation vers l'accordéon FAQ Klarna de la home : on conserve le `href`
   * `/#faq-klarna` pour le SEO (clic-droit, ouverture dans un nouvel onglet,
   * crawlers) tout en interceptant le clic gauche pour piloter à la fois la
   * navigation Angular et l'ouverture de l'accordéon — ce que `routerLink +
   * fragment` seul ne fait pas quand l'utilisateur est déjà sur la home
   * (Angular ignore par défaut la navigation vers la même URL, donc l'observable
   * `route.fragment` ne réémet jamais).
   */
  onKlarnaClick(event: MouseEvent): void {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    void this.router.navigateByUrl('/').then(() => this.klarnaFaq.requestOpen());
  }
}
