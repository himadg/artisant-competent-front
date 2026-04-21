import { Component, Input } from '@angular/core';

@Component({
  selector: 'supplier-profile',
  standalone: true,
  imports: [],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class SupplierProfile {
  @Input() user!: any;
}
