import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { Accordion } from '../../../shared/components/accordion';
import { ContactFormComponent } from '../../../shared/components/contact-form';
import { ContactFormService } from '../../services/contact-form.service';

@Component({
  selector: 'ac-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule, Accordion, ContactFormComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Footer {
  /**
   * Pilote le dépliage de l'accordéon « Formulaire de contact » lorsqu'une
   * ouverture est demandée ailleurs (ex. bouton « consultation CMOD » de la home).
   */
  protected readonly contactForm = inject(ContactFormService);
}
