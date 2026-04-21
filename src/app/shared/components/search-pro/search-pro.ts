import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'search-pro',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  templateUrl: './search-pro.html',
  styleUrl: './search-pro.scss',
})
export class SearchPro {
  query = '';
  address = '';
  trade = '';
  kilometersIndex = 0;
  trades = ['plumbing', 'electricity', 'masonry', 'gardening', 'locksmith'];
  ranges = [5, 10, 15, 20, 25, 30];

  get sliderPercent(): number {
    const p = (this.kilometersIndex / (this.ranges.length - 1)) * 100;
    const min = 6;
    const max = 94;
    return Math.max(min, Math.min(max, p));
  }

  get kilometers(): number {
    return this.ranges[this.kilometersIndex] ?? this.ranges[0];
  }

  submit() {
  }
}
