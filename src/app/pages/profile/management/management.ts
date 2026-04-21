import { Component, Input } from '@angular/core';

@Component({
  selector: 'management-profile',
  standalone: true,
  imports: [],
  templateUrl: './management.html',
  styleUrl: './management.scss',
})
export class ManagementProfile {
  @Input() user!: any;
}
