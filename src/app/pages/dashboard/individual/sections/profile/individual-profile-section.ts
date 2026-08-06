import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { IndividualDashboardStateService, ProfileEditFields } from '../../individual-dashboard-state.service';
import { LangService } from '../../../../../core/services/lang.service';
import { DATE_STYLE_FULL, formatLocalizedDate } from '../../../../../core/utils/date-format';
import { InlineEditActions } from '../../../../../shared/components/inline-edit-actions/inline-edit-actions';
import { FlashMessageService } from '../../../../../core/services/flash-message.service';
import { NAME_REGEXP, PHONE_FR_REGEXP, POSTAL_CODE_REGEXP, STREET_NUMBER_REGEXP } from '../../../../../core/utils/regexp';

@Component({
  selector: 'individual-profile-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TranslocoModule, InlineEditActions],
  templateUrl: './individual-profile-section.html',
  styleUrl: './individual-profile-section.scss',
})
export class IndividualProfileSection {
  private readonly state = inject(IndividualDashboardStateService);
  private readonly langService = inject(LangService);
  private readonly flashMessage = inject(FlashMessageService);

  readonly data = this.state.data;

  readonly editMode = signal(false);
  readonly saving = signal(false);
  editFields: ProfileEditFields = {
    firstName: '', lastName: '', email: '', birthDate: '', gender: '', phone: '',
    address: { streetNumber: '', streetName: '', additionalInfo: '', postalCode: '', city: '' },
  };

  readonly birthDate = computed(() => {
    const data = this.data();
    if (!data) return '';
    return formatLocalizedDate(data.birthDate, this.langService.lang(), DATE_STYLE_FULL);
  });

  enterEditMode(): void {
    const d = this.data();
    if (!d) return;
    this.editFields = {
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      birthDate: d.birthDate.slice(0, 10),
      gender: d.gender,
      phone: d.individualProfile?.phone ?? '',
      address: {
        streetNumber: d.address?.streetNumber ?? '',
        streetName: d.address?.streetName ?? '',
        additionalInfo: d.address?.additionalInfo ?? '',
        postalCode: String(d.address?.postalCode ?? ''),
        city: d.address?.city ?? '',
      },
    };
    this.editMode.set(true);
  }

  cancelEdit(): void {
    this.editMode.set(false);
  }

  saveEdit(): void {
    const { firstName, lastName, email, birthDate, phone } = this.editFields;
    const { streetNumber, streetName, postalCode, city } = this.editFields.address;

    if (!firstName.trim() || !lastName.trim() || !NAME_REGEXP.test(firstName.trim()) || !NAME_REGEXP.test(lastName.trim())) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.individual.errors.nameInvalid' });
      return;
    }
    if (!email.trim() || Validators.email({ value: email.trim() } as any)) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.individual.errors.emailInvalid' });
      return;
    }
    if (!birthDate || new Date(birthDate) > new Date()) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.individual.errors.birthDateInvalid' });
      return;
    }
    if (!phone.trim() || !PHONE_FR_REGEXP.test(phone.trim())) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.individual.errors.phoneInvalid' });
      return;
    }
    if (!streetNumber.trim() || !streetName.trim() || !postalCode.trim() || !city.trim()) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.individual.errors.addressIncomplete' });
      return;
    }
    if (!STREET_NUMBER_REGEXP.test(streetNumber.trim())) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.individual.errors.streetNumberInvalid' });
      return;
    }
    if (!POSTAL_CODE_REGEXP.test(postalCode.trim())) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.individual.errors.postalCodeInvalid' });
      return;
    }
    if (!NAME_REGEXP.test(city.trim())) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.individual.errors.cityInvalid' });
      return;
    }

    this.saving.set(true);
    this.state.saveProfile(this.editFields)
      .then(() => this.editMode.set(false))
      .finally(() => this.saving.set(false));
  }
}
