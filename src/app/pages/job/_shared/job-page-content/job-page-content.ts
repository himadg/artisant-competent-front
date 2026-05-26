import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { JobPageContent } from '../job-content.types';

@Component({
  selector: 'app-job-page-content',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './job-page-content.html',
  styleUrl: './job-page-content.scss',
})
export class JobPageContentComponent {
  @Input({ required: true }) content!: JobPageContent;
}
