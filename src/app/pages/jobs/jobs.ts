import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  standalone: true,
  imports: [TranslocoModule, RouterModule],
  templateUrl: './jobs.html',
  styleUrl: './jobs.scss',
})
export class JobsPage {}
