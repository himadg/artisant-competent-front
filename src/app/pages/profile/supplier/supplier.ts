import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'supplier-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class SupplierProfile {
  @Input() user!: any;
}
