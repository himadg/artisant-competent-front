import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, ChangeDetectionStrategy } from '@angular/core';

import { LangService } from '../../../core/services/lang.service';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'lang-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule],
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
