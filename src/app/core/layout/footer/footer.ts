import { Component, CUSTOM_ELEMENTS_SCHEMA, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { ContactFormComponent } from '../../../shared/components/contact-form';

@Component({
  selector: 'ac-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule, ContactFormComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Footer {
  protected readonly contactModalOpen = signal(false);

  openContactModal(): void { this.contactModalOpen.set(true); }
  closeContactModal(): void { this.contactModalOpen.set(false); }
}
