import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [TranslocoModule, RouterModule],
  templateUrl: './affiliation.html',
  styleUrl: './affiliation.scss',
})
export class AffiliationPage {}
