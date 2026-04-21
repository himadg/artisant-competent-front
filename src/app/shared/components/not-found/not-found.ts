import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'not-found',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {

}
