import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'theme-toggle',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
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
