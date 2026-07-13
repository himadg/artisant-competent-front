import { Component, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ProfessionalSearchResult } from '../../../shared/interfaces/professional-profile';

@Component({
  selector: 'pro-card',
  standalone: true,
  imports: [DecimalPipe, RouterModule, TranslocoModule],
  templateUrl: './pro-card.html',
  styleUrl: './pro-card.scss',
})
export class ProCard {
  readonly proInfo = input.required<ProfessionalSearchResult>();
  readonly selected = input(false);
  readonly selectedChange = output<boolean>();
  readonly showDetails = signal(false);

  getFullWorkAddress(): string {
    const { additionalInfo, streetNumber, streetName, postalCode, city } = this.proInfo().workAddress;
    return [additionalInfo, `${streetNumber} ${streetName}`, `${postalCode} ${city}`]
      .filter(Boolean)
      .join(', ');
  }

  get openingHoursDays() {
    return this.proInfo().openingHours?.days ?? [];
  }

  formatIntervals(intervals: { start: string; end: string }[]): string {
    return intervals.map(i => `${i.start} – ${i.end}`).join(', ');
  }
}
