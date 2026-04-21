import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RegisterIndividual } from './individual/individual';
import { RegisterProfessional } from './professional/professional';
import { RegisterSupplier } from './supplier/supplier';
import { NotFound } from '../../../shared/components/not-found/not-found';
import { UserType } from '../../../core/utils/common-utils';

@Component({
  standalone: true,
  imports: [CommonModule, RegisterIndividual, RegisterProfessional, RegisterSupplier, NotFound],
  templateUrl: './register.html',
})
export class RegisterPage {
  userType: UserType = UserType.INDIVIDUAL;

  constructor(route: ActivatedRoute) {
    route.queryParamMap.subscribe((params) => {
      const t = params.get('t') as UserType;
      if (Object.values(UserType).includes(t)) this.userType = t;
    });
  }
}
