import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { LegalModal } from '../../../shared/components/legal-modal/legal-modal';
import { PolicyModal } from '../../../shared/components/policy-modal/policy-modal';
import { ContactFormComponent } from '../../../shared/components/contact-form';

@Component({
  selector: 'ac-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule, LegalModal, PolicyModal, ContactFormComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Footer {
  protected readonly legalModalOpen = signal(false);
  protected readonly contactModalOpen = signal(false);
  protected readonly annulationModalOpen = signal(false);
  protected readonly confidentialiteModalOpen = signal(false);
  protected readonly cookiesModalOpen = signal(false);

  openContactModal(): void { this.contactModalOpen.set(true); }
  closeContactModal(): void { this.contactModalOpen.set(false); }

  openLegalModal(): void { this.legalModalOpen.set(true); }
  closeLegalModal(): void { this.legalModalOpen.set(false); }

  openAnnulationModal(): void { this.annulationModalOpen.set(true); }
  closeAnnulationModal(): void { this.annulationModalOpen.set(false); }

  openConfidentialiteModal(): void { this.confidentialiteModalOpen.set(true); }
  closeConfidentialiteModal(): void { this.confidentialiteModalOpen.set(false); }

  openCookiesModal(): void { this.cookiesModalOpen.set(true); }
  closeCookiesModal(): void { this.cookiesModalOpen.set(false); }
}
