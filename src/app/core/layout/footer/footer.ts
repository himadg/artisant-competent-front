import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { RouterModule } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideYoutube, lucideLinkedin } from '@ng-icons/lucide';
import { Accordion } from '../../../shared/components/accordion';

@Component({
  selector: 'ac-footer',
  standalone: true,
  imports: [TranslocoModule, RouterModule, NgIconComponent, Accordion],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  viewProviders: [provideIcons({ lucideYoutube, lucideLinkedin })],
})
export class Footer {}
