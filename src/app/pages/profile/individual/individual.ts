import { Component, Input } from '@angular/core';

@Component({
  selector: 'individual-profile',
  standalone: true,
  imports: [],
  templateUrl: './individual.html',
  styleUrl: './individual.scss',
})
export class IndividualProfile {
  @Input() user!: any;
}
