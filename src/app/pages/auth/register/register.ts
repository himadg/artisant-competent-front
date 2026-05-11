import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { RegisterIndividual } from './individual/individual';
import { RegisterProfessional } from './professional/professional';
import { RegisterSupplier } from './supplier/supplier';
import { UserType } from '../../../core/utils/common-utils';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoModule, RegisterIndividual, RegisterProfessional, RegisterSupplier],
  templateUrl: './register.html',
})
export class RegisterPage {
  userType: UserType | null = null;

  constructor(route: ActivatedRoute) {
    route.queryParamMap.subscribe((params) => {
      const type = params.get('t') as UserType;
      this.userType = Object.values(UserType).includes(type) ? type : null;
    });
  }
}
