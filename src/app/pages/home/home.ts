import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { SearchPro } from '../../shared/components/search-pro/search-pro';

@Component({
  standalone: true,
  imports: [TranslocoModule, RouterModule, SearchPro],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {}
