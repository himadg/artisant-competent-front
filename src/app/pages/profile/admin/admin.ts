import { Component, Input } from '@angular/core';

@Component({
  selector: 'admin-profile',
  standalone: true,
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminProfile {
  @Input() user!: any;
}
