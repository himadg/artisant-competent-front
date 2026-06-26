import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FaqSection } from '../../shared/components/faq/faq';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FaqSection],
  templateUrl: './faq-page.html',
})
export class FaqPage {}
