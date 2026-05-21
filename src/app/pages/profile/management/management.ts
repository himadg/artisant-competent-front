import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'management-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './management.html',
  styleUrl: './management.scss',
})
export class ManagementProfile {
  @Input() user!: any;
}
