import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ac-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {}
