import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { GeocodingService } from '../../../../../core/services/geocoding.service';
import { UserApiService } from '../../../../../core/services/user-api.service';
import { AddressSuggestion } from '../../../../../shared/interfaces/address-suggestion';
import { OpeningHoursDay } from '../../../../../shared/interfaces/professional-dashboard';
import { InlineEditActions } from '../../../../../shared/components/inline-edit-actions/inline-edit-actions';
import { LocalizedDatePipe } from '../../../../../shared/pipes/localized-date.pipe';
import { FlashMessageService } from '../../../../../core/services/flash-message.service';
import { nameValidator, addressValidator, urlValidator } from '../../../../../core/utils/validators';
import { ProfessionalDashboardStateService } from '../../professional-dashboard-state.service';

const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

@Component({
  selector: 'professional-profile-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, TranslocoModule, InlineEditActions, LocalizedDatePipe],
  templateUrl: './professional-profile-section.html',
  styleUrl: './professional-profile-section.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfessionalProfileSection {
  private readonly state = inject(ProfessionalDashboardStateService);
  private readonly userApi = inject(UserApiService);
  private readonly geocodingService = inject(GeocodingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly flashMessage = inject(FlashMessageService);

  readonly data = this.state.data;
  readonly activeTab = this.state.activeTab;

  // ── Description ──────────────────────────────────────────────────────────
  readonly editDescriptionMode = signal(false);
  readonly savingDescription = signal(false);
  editDescriptionText = '';

  enterEditDescription(): void {
    const p = this.data()?.professionalProfile;
    if (!p) return;
    this.editDescriptionText = p.description;
    this.editDescriptionMode.set(true);
  }

  cancelEditDescription(): void { this.editDescriptionMode.set(false); }

  saveEditDescription(): void {
    if (!this.editDescriptionText.trim()) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.pro.fieldRequiredError' });
      return;
    }
    this.savingDescription.set(true);
    this.state.saveDescription(this.editDescriptionText)
      .then(() => this.editDescriptionMode.set(false))
      .finally(() => this.savingDescription.set(false));
  }

  // ── Trades ───────────────────────────────────────────────────────────────
  readonly editTradesMode = signal(false);
  readonly savingTrades = signal(false);
  readonly loadingTrades = signal(false);
  readonly editTradeIds = signal<string[]>([]);
  readonly allTrades = signal<{ id: string; name: string }[]>([]);

  enterEditTrades(): void {
    const professional = this.data()?.professionalProfile;
    if (!professional) return;
    this.editTradeIds.set(professional.trades.map((trade) => trade.id));
    if (!this.allTrades().length) {
      this.loadingTrades.set(true);
      this.userApi.getAllTrades().subscribe({
        next: (trades) => { this.allTrades.set(trades); this.loadingTrades.set(false); },
        error: () => this.loadingTrades.set(false),
      });
    }
    this.editTradesMode.set(true);
  }

  cancelEditTrades(): void { this.editTradesMode.set(false); }

  toggleTrade(id: string): void {
    this.editTradeIds.update((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]));
  }

  saveEditTrades(): void {
    if (this.editTradeIds().length === 0) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.pro.noTradesError' });
      return;
    }
    this.savingTrades.set(true);
    this.state.saveTrades(this.editTradeIds(), this.allTrades())
      .then(() => this.editTradesMode.set(false))
      .finally(() => this.savingTrades.set(false));
  }

  // ── Opening hours ─────────────────────────────────────────────────────────
  readonly editHoursMode = signal(false);
  readonly savingHours = signal(false);
  readonly editHours = signal<OpeningHoursDay[]>([]);

  enterEditHours(): void {
    const openingHours = this.data()?.professionalProfile.openingHours;
    if (openingHours?.days?.length === 7) {
      this.editHours.set(
        (structuredClone(openingHours.days) as OpeningHoursDay[]).map((day) => ({
          ...day,
          intervals: day.intervals.length ? day.intervals : [],
        })),
      );
    } else {
      this.editHours.set(WEEK_DAYS.map((day) => ({ day, closed: true, onCall: false, intervals: [] })));
    }
    this.editHoursMode.set(true);
  }

  cancelEditHours(): void { this.editHoursMode.set(false); }

  toggleDay(index: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.editHours.update((days) => days.map((day, i) => (i !== index ? day : { ...day, closed: !checked, onCall: false })));
  }

  toggleOnCall(index: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.editHours.update((days) => days.map((d, i) => (i !== index ? d : { ...d, onCall: checked })));
  }

  setHourStart(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.editHours.update((days) =>
      days.map((d, i) => (i === index ? { ...d, intervals: [{ start: value, end: d.intervals[0]?.end ?? '18:00' }] } : d)),
    );
  }

  setHourEnd(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.editHours.update((days) =>
      days.map((d, i) => (i === index ? { ...d, intervals: [{ start: d.intervals[0]?.start ?? '08:00', end: value }] } : d)),
    );
  }

  saveEditHours(): void {
    this.savingHours.set(true);
    this.state.saveHours(this.editHours())
      .then(() => this.editHoursMode.set(false))
      .finally(() => this.savingHours.set(false));
  }

  // ── Partners ─────────────────────────────────────────────────────────────
  readonly editPartnersMode = signal(false);
  readonly savingPartners = signal(false);
  readonly editPartnerList = signal<string[]>([]);
  partnerInput = '';

  enterEditPartners(): void {
    this.editPartnerList.set([...(this.data()?.professionalProfile.suppliers ?? [])]);
    this.partnerInput = '';
    this.editPartnersMode.set(true);
  }

  cancelEditPartners(): void { this.editPartnersMode.set(false); }

  addPartnerToEdit(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    this.addPartnerFromInput();
  }

  addPartnerFromInput(): void {
    const name = this.partnerInput.trim();
    if (!name || this.editPartnerList().includes(name)) return;
    this.editPartnerList.update((list) => [...list, name]);
    this.partnerInput = '';
  }

  removePartnerFromEdit(name: string): void {
    this.editPartnerList.update((list) => list.filter((p) => p !== name));
  }

  saveEditPartners(): void {
    if (this.editPartnerList().length === 0) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.pro.noPartnersError' });
      return;
    }
    this.savingPartners.set(true);
    this.state.savePartners(this.editPartnerList())
      .then(() => this.editPartnersMode.set(false))
      .finally(() => this.savingPartners.set(false));
  }

  // ── Personal info ─────────────────────────────────────────────────────────
  readonly editPersonalInfoMode = signal(false);
  readonly savingPersonalInfo = signal(false);
  editPersonalInfo = {
    gender: '', lastName: '', firstName: '', birthDate: '', email: '', professionalEmail: '', managerPhone: '',
    address: { streetNumber: '', streetName: '', additionalInfo: '', postalCode: '', city: '' },
  };

  private readonly personalAddressSearch$ = new Subject<string>();
  readonly personalAddressSuggestions = signal<AddressSuggestion[]>([]);
  readonly personalAddressOpen = signal(false);

  enterEditPersonalInfo(): void {
    const d = this.data();
    if (!d) return;
    const p = d.professionalProfile;
    this.editPersonalInfo = {
      gender: d.gender,
      lastName: d.lastName,
      firstName: d.firstName,
      birthDate: d.birthDate ? d.birthDate.slice(0, 10) : '',
      email: d.email,
      professionalEmail: p.professionalEmail ?? '',
      managerPhone: p.managerPhone,
      address: {
        streetNumber: d.address?.streetNumber ?? '',
        streetName: d.address?.streetName ?? '',
        additionalInfo: d.address?.additionalInfo ?? '',
        postalCode: String(d.address?.postalCode ?? ''),
        city: d.address?.city ?? '',
      },
    };
    this.editPersonalInfoMode.set(true);
  }

  cancelEditPersonalInfo(): void { this.editPersonalInfoMode.set(false); }

  saveEditPersonalInfo(): void {
    const { gender, lastName, firstName, birthDate, email, managerPhone } = this.editPersonalInfo;
    const { streetNumber, streetName, postalCode, city } = this.editPersonalInfo.address;
    if (!gender.trim() || !lastName.trim() || !firstName.trim() || !birthDate.trim() || !email.trim() || !managerPhone.trim()) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.pro.fieldRequiredError' });
      return;
    }
    if (!streetNumber.trim() || !streetName.trim() || !postalCode.trim() || !city.trim()) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.pro.personalAddressError' });
      return;
    }
    this.savingPersonalInfo.set(true);
    this.state.savePersonalInfo(this.editPersonalInfo)
      .then(() => this.editPersonalInfoMode.set(false))
      .finally(() => this.savingPersonalInfo.set(false));
  }

  onPersonalAddressSearch(e: Event): void {
    const q = (e.target as HTMLInputElement).value;
    if (q.length < 3) { this.personalAddressSuggestions.set([]); return; }
    this.personalAddressSearch$.next(q);
  }

  selectPersonalAddress(addr: AddressSuggestion): void {
    this.personalAddressSuggestions.set([]);
    this.personalAddressOpen.set(false);
    if (addr.streetNumber) this.editPersonalInfo.address.streetNumber = addr.streetNumber;
    this.editPersonalInfo.address.streetName = addr.streetName;
    this.editPersonalInfo.address.postalCode = addr.postalCode;
    this.editPersonalInfo.address.city = addr.city;
  }

  closePersonalAddressSuggestions(): void {
    setTimeout(() => this.personalAddressOpen.set(false), 150);
  }

  onPersonalPostalCodeInput(e: Event): void {
    const code = (e.target as HTMLInputElement).value;
    if (code.length !== 5) return;
    this.geocodingService.lookupCity(code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((city) => {
      if (city) this.editPersonalInfo.address.city = city;
    });
  }

  // ── Mediator ──────────────────────────────────────────────────────────────
  readonly editMediatorMode = signal(false);
  readonly savingMediator = signal(false);
  editMediator = { mediatorName: '', mediatorAddress: '', mediatorWebsite: '', mediatorContactMethod: '', mediatorAdditionalInfo: '' };

  enterEditMediator(): void {
    const p = this.data()?.professionalProfile;
    if (!p) return;
    this.editMediator = {
      mediatorName: p.mediatorName ?? '',
      mediatorAddress: p.mediatorAddress ?? '',
      mediatorWebsite: p.mediatorWebsite ?? '',
      mediatorContactMethod: p.mediatorContactMethod ?? '',
      mediatorAdditionalInfo: p.mediatorAdditionalInfo ?? '',
    };
    this.editMediatorMode.set(true);
  }

  cancelEditMediator(): void { this.editMediatorMode.set(false); }

  saveEditMediator(): void {
    const { mediatorName, mediatorAddress, mediatorWebsite, mediatorContactMethod } = this.editMediator;
    const filled = [mediatorName, mediatorAddress, mediatorWebsite, mediatorContactMethod].map((v) => v.trim());
    const someFilled = filled.some((v) => v.length > 0);
    const allFilled = filled.every((v) => v.length > 0);
    if (someFilled && !allFilled) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.pro.mediatorIncompleteError' });
      return;
    }
    if (nameValidator({ value: mediatorName } as any)) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.pro.mediatorNameInvalid' });
      return;
    }
    if (addressValidator({ value: mediatorAddress } as any)) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.pro.mediatorAddressInvalid' });
      return;
    }
    if (urlValidator({ value: mediatorWebsite } as any)) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.pro.mediatorWebsiteInvalid' });
      return;
    }
    this.savingMediator.set(true);
    this.state.saveMediator(this.editMediator)
      .then(() => this.editMediatorMode.set(false))
      .finally(() => this.savingMediator.set(false));
  }

  // ── Additional remarks ────────────────────────────────────────────────────
  readonly editAdditionalRemarksMode = signal(false);
  readonly savingAdditionalRemarks = signal(false);
  editAdditionalRemarksText = '';

  enterEditAdditionalRemarks(): void {
    this.editAdditionalRemarksText = this.data()?.professionalProfile.additionalRemarks ?? '';
    this.editAdditionalRemarksMode.set(true);
  }

  cancelEditAdditionalRemarks(): void { this.editAdditionalRemarksMode.set(false); }

  saveEditAdditionalRemarks(): void {
    this.savingAdditionalRemarks.set(true);
    this.state.saveAdditionalRemarks(this.editAdditionalRemarksText)
      .then(() => this.editAdditionalRemarksMode.set(false))
      .finally(() => this.savingAdditionalRemarks.set(false));
  }

  // ── Company extra (yearsExperience, onCall, adresse de travail) ──────────
  readonly editCompanyExtraMode = signal(false);
  readonly savingCompanyExtra = signal(false);
  editCompanyExtra = {
    yearsExperience: 0, onCall: false,
    workAddress: { streetNumber: '', streetName: '', additionalInfo: '', postalCode: '', city: '' },
  };

  private readonly workAddressSearch$ = new Subject<string>();
  readonly workAddressSuggestions = signal<AddressSuggestion[]>([]);
  readonly workAddressOpen = signal(false);

  enterEditCompanyExtra(): void {
    const p = this.data()?.professionalProfile;
    if (!p) return;
    this.editCompanyExtra = {
      yearsExperience: p.yearsExperience,
      onCall: p.onCall,
      workAddress: {
        streetNumber: p.workAddress?.streetNumber ?? '',
        streetName: p.workAddress?.streetName ?? '',
        additionalInfo: p.workAddress?.additionalInfo ?? '',
        postalCode: String(p.workAddress?.postalCode ?? ''),
        city: p.workAddress?.city ?? '',
      },
    };
    this.editCompanyExtraMode.set(true);
  }

  cancelEditCompanyExtra(): void { this.editCompanyExtraMode.set(false); }

  saveEditCompanyExtra(): void {
    const { streetNumber, streetName, postalCode, city } = this.editCompanyExtra.workAddress;
    if (!streetNumber.trim() || !streetName.trim() || !postalCode.trim() || !city.trim()) {
      this.flashMessage.set({ type: 'error', key: 'dashboard.pro.workAddressError' });
      return;
    }
    this.savingCompanyExtra.set(true);
    this.state.saveCompanyExtra(this.editCompanyExtra)
      .then(() => this.editCompanyExtraMode.set(false))
      .finally(() => this.savingCompanyExtra.set(false));
  }

  onWorkAddressSearch(e: Event): void {
    const q = (e.target as HTMLInputElement).value;
    if (q.length < 3) { this.workAddressSuggestions.set([]); return; }
    this.workAddressSearch$.next(q);
  }

  selectWorkAddress(addr: AddressSuggestion): void {
    this.workAddressSuggestions.set([]);
    this.workAddressOpen.set(false);
    if (addr.streetNumber) this.editCompanyExtra.workAddress.streetNumber = addr.streetNumber;
    this.editCompanyExtra.workAddress.streetName = addr.streetName;
    this.editCompanyExtra.workAddress.postalCode = addr.postalCode;
    this.editCompanyExtra.workAddress.city = addr.city;
  }

  closeWorkAddressSuggestions(): void {
    setTimeout(() => this.workAddressOpen.set(false), 150);
  }

  onWorkPostalCodeInput(e: Event): void {
    const code = (e.target as HTMLInputElement).value;
    if (code.length !== 5) return;
    this.geocodingService.lookupCity(code).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((city) => {
      if (city) this.editCompanyExtra.workAddress.city = city;
    });
  }

  // ── Company remarks ───────────────────────────────────────────────────────
  readonly editCompanyRemarksMode = signal(false);
  readonly savingCompanyRemarks = signal(false);
  editCompanyRemarksText = '';

  enterEditCompanyRemarks(): void {
    this.editCompanyRemarksText = this.data()?.professionalProfile.companyRemarks ?? '';
    this.editCompanyRemarksMode.set(true);
  }

  cancelEditCompanyRemarks(): void { this.editCompanyRemarksMode.set(false); }

  saveEditCompanyRemarks(): void {
    this.savingCompanyRemarks.set(true);
    this.state.saveCompanyRemarks(this.editCompanyRemarksText)
      .then(() => this.editCompanyRemarksMode.set(false))
      .finally(() => this.savingCompanyRemarks.set(false));
  }

  // ── Trusted contact ───────────────────────────────────────────────────────
  readonly editTrustedContactMode = signal(false);
  readonly savingTrustedContact = signal(false);
  editTrustedContact = { name: '', phone: '' };

  enterEditTrustedContact(): void {
    const p = this.data()?.professionalProfile;
    if (!p) return;
    this.editTrustedContact = { name: p.trustedContactName ?? '', phone: p.trustedContactPhone ?? '' };
    this.editTrustedContactMode.set(true);
  }

  cancelEditTrustedContact(): void { this.editTrustedContactMode.set(false); }

  saveEditTrustedContact(): void {
    this.savingTrustedContact.set(true);
    this.state.saveTrustedContact(this.editTrustedContact.name, this.editTrustedContact.phone)
      .then(() => this.editTrustedContactMode.set(false))
      .finally(() => this.savingTrustedContact.set(false));
  }

  // ── Documents ─────────────────────────────────────────────────────────────
  openDocModal(url: string | null | undefined, labelKey: string): void {
    this.state.openDocModal(url, labelKey);
  }

  constructor() {
    this.personalAddressSearch$.pipe(
      debounceTime(300), distinctUntilChanged(),
      filter((q) => q.length >= 3),
      switchMap((q) => this.geocodingService.search(q)),
      takeUntilDestroyed(),
    ).subscribe((s) => this.personalAddressSuggestions.set(s));

    this.workAddressSearch$.pipe(
      debounceTime(300), distinctUntilChanged(),
      filter((q) => q.length >= 3),
      switchMap((q) => this.geocodingService.search(q)),
      takeUntilDestroyed(),
    ).subscribe((s) => this.workAddressSuggestions.set(s));
  }
}
