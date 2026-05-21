import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IndividualProfile } from './individual/individual';
import { ProfessionalProfile } from './professional/professional';
import { SupplierProfile } from './supplier/supplier';
import { AdminProfile } from './admin/admin';
import { NotFound } from '../../shared/components/not-found/not-found';
import { ManagementProfile } from './management/management';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IndividualProfile, ProfessionalProfile, SupplierProfile, AdminProfile, ManagementProfile, NotFound],
  templateUrl: './profile.html',
})
export class ProfilePage {
  @Input() user!: any;
}
