import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'individual-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './individual.html',
  styleUrl: './individual.scss',
})
export class IndividualProfile {
  @Input() user!: any;
}
