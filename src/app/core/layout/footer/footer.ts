import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'ac-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Footer {}
