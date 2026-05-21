import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'admin-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminProfile {
  @Input() user!: any;
}
