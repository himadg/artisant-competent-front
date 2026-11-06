import { Component, inject, input, output, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ProfessionalSearchResult } from '../../../shared/interfaces/professional-profile';
import { ImageSkeleton } from '../image-skeleton/image-skeleton';
import { StoryApiService } from '../../../core/services/story-api.service';
import { StoryViewer } from '../story-viewer/story-viewer';
import { StoryFeedItem } from '../../interfaces/story';

@Component({
  selector: 'pro-card',
  standalone: true,
  imports: [DecimalPipe, RouterModule, TranslocoModule, ImageSkeleton, StoryViewer],
  templateUrl: './pro-card.html',
  styleUrl: './pro-card.scss',
})
export class ProCard {
  private readonly storyApi = inject(StoryApiService);

  readonly proInfo = input.required<ProfessionalSearchResult>();
  readonly selected = input(false);
  readonly selectedChange = output<boolean>();
  readonly showDetails = signal(false);
  readonly logoLoaded = signal(false);
  readonly presentationStory = signal<StoryFeedItem | null>(null);
  readonly loadingPresentation = signal(false);
  readonly viewingPresentation = signal(false);

  getFullWorkAddress(): string {
    const { additionalInfo, streetNumber, streetName, postalCode, city } = this.proInfo().workAddress;
    return [additionalInfo, `${streetNumber} ${streetName}`, `${postalCode} ${city}`]
      .filter(Boolean)
      .join(', ');
  }

  get openingHoursDays() {
    return this.proInfo().openingHours?.days ?? [];
  }

  formatIntervals(intervals: { start: string; end: string }[]): string {
    return intervals.map(i => `${i.start} – ${i.end}`).join(', ');
  }

  openDetails() {
    this.showDetails.set(true);
    if (this.presentationStory() || this.loadingPresentation()) return;
    this.loadingPresentation.set(true);
    this.storyApi.getPresentation(this.proInfo().id).subscribe({
      next: (presentation) => {
        this.loadingPresentation.set(false);
        this.presentationStory.set(presentation);
      },
      error: () => this.loadingPresentation.set(false),
    });
  }

  openPresentationViewer() {
    if (this.presentationStory()) this.viewingPresentation.set(true);
  }

  closePresentationViewer() {
    this.viewingPresentation.set(false);
  }
}
