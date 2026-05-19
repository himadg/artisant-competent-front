import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideYoutube, lucideLinkedin } from '@ng-icons/lucide';
import { Accordion } from '../../../shared/components/accordion';
import { ContactFormComponent } from '../../../shared/components/contact-form';
import { ContactFormService } from '../../services/contact-form.service';

@Component({
  selector: 'ac-footer',
  standalone: true,
  imports: [TranslocoModule, RouterModule, NgIconComponent, Accordion, ContactFormComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  viewProviders: [provideIcons({ lucideYoutube, lucideLinkedin })],
})
export class Footer {
  /**
   * Pilote le dépliage de l'accordéon « Formulaire de contact » lorsqu'une
   * ouverture est demandée ailleurs (ex. bouton « consultation CMOD » de la home).
   */
  protected readonly contactForm = inject(ContactFormService);
}
