import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectionStrategy } from '@angular/core';

import { TranslocoModule } from '@jsverse/transloco';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ThemeToggle {
  readonly themeService = inject(ThemeService);

  toggle() {
    this.themeService.toggle();
  }
}
