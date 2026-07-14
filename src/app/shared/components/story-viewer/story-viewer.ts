import { Component, input, output, computed, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

export interface StoryViewerItem {
  createdAt: string;
}

interface StoryViewerSnapshot {
  story: StoryViewerItem;
  videoUrl: string | null;
  label: string | null;
  hasPrev: boolean;
  hasNext: boolean;
  allowDelete: boolean;
  currentIndex: number;
  total: number;
  showProfileLink: boolean;
}

const CLOSE_ANIMATION_MS = 220;

@Component({
  selector: 'story-viewer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './story-viewer.html',
  styleUrl: './story-viewer.scss',
})
export class StoryViewer {
  story = input<StoryViewerItem | null>(null);
  videoUrl = input<string | null>(null);
  hasPrev = input(false);
  hasNext = input(false);
  allowDelete = input(true);
  label = input<string | null>(null);
  currentIndex = input(0);
  total = input(0);
  showProfileLink = input(false);
  closeModal = output<void>();
  deleteRequested = output<void>();
  prevRequested = output<void>();
  nextRequested = output<void>();
  profileRequested = output<void>();

  // Keeps the last story rendered while the close animation plays, since the
  // `story` input goes straight to null the instant the parent closes it.
  readonly closing = signal(false);
  readonly viewerState = signal<StoryViewerSnapshot | null>(null);
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const story = this.story();
      if (story) {
        if (this.closeTimer) {
          clearTimeout(this.closeTimer);
          this.closeTimer = null;
        }
        this.closing.set(false);
        this.viewerState.set({
          story,
          videoUrl: this.videoUrl(),
          label: this.label(),
          hasPrev: this.hasPrev(),
          hasNext: this.hasNext(),
          allowDelete: this.allowDelete(),
          currentIndex: this.currentIndex(),
          total: this.total(),
          showProfileLink: this.showProfileLink(),
        });
      } else if (this.viewerState() && !this.closing()) {
        this.closing.set(true);
        this.closeTimer = setTimeout(() => {
          this.viewerState.set(null);
          this.closing.set(false);
          this.closeTimer = null;
        }, CLOSE_ANIMATION_MS);
      }
    });
  }

  timeAgo = computed(() => {
    const story = this.viewerState()?.story;
    if (!story) return '';
    const diffMs = Date.now() - new Date(story.createdAt).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "à l'instant";
    if (diffMin < 60) return `il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    return `il y a ${diffH} h`;
  });

  showCounter = computed(() => (this.viewerState()?.total ?? 0) > 1);
}
