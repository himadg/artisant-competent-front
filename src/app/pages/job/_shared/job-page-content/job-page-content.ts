import { Component, Input } from '@angular/core';
import type { JobPageContent } from '../job-content.types';

@Component({
  selector: 'app-job-page-content',
  standalone: true,
  templateUrl: './job-page-content.html',
  styleUrl: './job-page-content.scss',
})
export class JobPageContentComponent {
  @Input({ required: true }) content!: JobPageContent;
}
