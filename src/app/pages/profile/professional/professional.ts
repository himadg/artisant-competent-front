import { Component, Input, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucideSearch,
  lucideFileText,
  lucideReceipt,
  lucideSettings,
  lucideBuilding2,
  lucideBookOpen,
  lucideLogOut,
  lucideCheck,
  lucideChevronRight,
  lucidePencil,
  lucideBell,
  lucideMail,
} from '@ng-icons/lucide';
import { DatePipe } from '@angular/common';
import { AppConfigService } from '../../../core/services/app-config.service';

type SidebarSection = 'requests' | 'quotes' | 'invoices' | 'profile' | 'legal' | 'practices';
type ProfileTab = 'presentation' | 'services' | 'missions' | 'reviews';

@Component({
  selector: 'professional-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIconComponent, DatePipe],
  templateUrl: './professional.html',
  styleUrl: './professional.scss',
  viewProviders: [
    provideIcons({
      lucideSearch,
      lucideFileText,
      lucideReceipt,
      lucideSettings,
      lucideBuilding2,
      lucideBookOpen,
      lucideLogOut,
      lucideCheck,
      lucideChevronRight,
      lucidePencil,
      lucideBell,
      lucideMail,
    }),
  ],
})
export class ProfessionalProfile {
  @Input() user!: any;

  private readonly config = inject(AppConfigService);

  activeSection = signal<SidebarSection>('profile');
  activeTab = signal<ProfileTab>('presentation');

  get profile() {
    return this.user?.professionalProfile;
  }

  get fullName() {
    return `${this.user?.firstName ?? ''} ${this.user?.lastName ?? ''}`.trim();
  }

  get address() {
    const a = this.profile?.workAddress;
    if (!a) return '';
    return `${a.streetNumber} ${a.streetName}, ${a.postalCode} ${a.city}`;
  }

  get cmodYear() {
    return new Date(this.user?.createdAt).getFullYear();
  }

  get photoUrl() {
    const key = this.profile?.photoKey;
    if (!key) return null;
    if (key.startsWith('http')) return key;
    const base = this.config.get('apiUrl') ?? '';
    return `${base}/uploads/${key}`;
  }

  get trustedContactPhotoUrl() {
    return null;
  }

  navItems = [
    { id: 'requests' as SidebarSection, label: 'Mes demandes', icon: 'lucideSearch' },
    { id: 'quotes' as SidebarSection, label: 'Mes devis', icon: 'lucideFileText' },
    { id: 'invoices' as SidebarSection, label: 'Mes factures', icon: 'lucideReceipt' },
    { id: 'profile' as SidebarSection, label: 'Infos personnelles', icon: 'lucideSettings' },
    { id: 'legal' as SidebarSection, label: 'Informations légales', icon: 'lucideBuilding2' },
    { id: 'practices' as SidebarSection, label: 'Bonnes pratiques', icon: 'lucideBookOpen' },
  ];

  tabs: { id: ProfileTab; label: string }[] = [
    { id: 'presentation', label: 'Présentation' },
    { id: 'services', label: 'Services proposés' },
    { id: 'missions', label: 'Missions CMOD' },
    { id: 'reviews', label: 'Avis' },
  ];

  setSection(id: SidebarSection) {
    this.activeSection.set(id);
  }

  setTab(id: ProfileTab) {
    this.activeTab.set(id);
  }
}
