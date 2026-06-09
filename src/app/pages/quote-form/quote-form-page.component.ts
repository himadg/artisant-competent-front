import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteFormComponent } from '../../shared/components/quote-form/quote-form.component';

@Component({
  selector: 'ac-quote-form-page',
  standalone: true,
  imports: [CommonModule, QuoteFormComponent],
  templateUrl: './quote-form-page.component.html',
  styleUrls: ['./quote-form-page.component.scss']
})
export class QuoteFormPageComponent {

}
