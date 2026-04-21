import { Component, Input } from '@angular/core';

@Component({
  selector: 'professional-profile',
  standalone: true,
  imports: [],
  templateUrl: './professional.html',
  styleUrl: './professional.scss',
})
export class ProfessionalProfile {
  @Input() user!: any;
}
