import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '../../../core/services/lang.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lang-toggle',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './lang-toggle.html',
  styleUrl: './lang-toggle.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LangToggle {
  readonly langService = inject(LangService);

  toggle() {
    this.langService.toggle();
  }
}
