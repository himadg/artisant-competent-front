import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Story } from '../../../core/services/story-api.service';

@Component({
  selector: 'story-viewer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './story-viewer.html',
  styleUrl: './story-viewer.scss',
})
export class StoryViewer {
  story = input<Story | null>(null);
  videoUrl = input<string | null>(null);
  closeModal = output<void>();
  deleteRequested = output<void>();

  timeAgo = computed(() => {
    const story = this.story();
    if (!story) return '';
    const diffMs = Date.now() - new Date(story.createdAt).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "à l'instant";
    if (diffMin < 60) return `il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    return `il y a ${diffH} h`;
  });
}
