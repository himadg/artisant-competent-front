import { ChangeDetectionStrategy, Component, OnInit, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StoryApiService, StoryFeedItem } from '../../../core/services/story-api.service';
import { StoryViewer } from '../story-viewer/story-viewer';

export interface StoryGroup {
  professionalProfileId: string;
  companyName: string;
  avatarUrl: string | null;
  stories: StoryFeedItem[];
}

function groupByProfessional(stories: StoryFeedItem[]): StoryGroup[] {
  const groups = new Map<string, StoryGroup>();
  for (const story of stories) {
    const existing = groups.get(story.professionalProfileId);
    if (existing) {
      existing.stories.push(story);
    } else {
      groups.set(story.professionalProfileId, {
        professionalProfileId: story.professionalProfileId,
        companyName: story.companyName,
        avatarUrl: story.avatarUrl,
        stories: [story],
      });
    }
  }
  return [...groups.values()];
}

@Component({
  selector: 'story-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, StoryViewer],
  templateUrl: './story-bar.html',
  styleUrl: './story-bar.scss',
})
export class StoryBar implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storyApi = inject(StoryApiService);

  readonly groups = signal<StoryGroup[]>([]);
  readonly loading = signal(true);

  readonly viewingGroupIndex = signal<number | null>(null);
  readonly viewingStoryIndex = signal(0);

  readonly viewingGroup = computed<StoryGroup | null>(() => {
    const index = this.viewingGroupIndex();
    return index === null ? null : (this.groups()[index] ?? null);
  });
  readonly viewingStory = computed<StoryFeedItem | null>(() => {
    const group = this.viewingGroup();
    return group ? (group.stories[this.viewingStoryIndex()] ?? null) : null;
  });
  readonly hasPrev = computed(() => this.viewingStoryIndex() > 0);
  readonly hasNext = computed(() => {
    const group = this.viewingGroup();
    return !!group && this.viewingStoryIndex() < group.stories.length - 1;
  });

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId) || !navigator.geolocation) {
      this.loading.set(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.storyApi.getFeed(position.coords.latitude, position.coords.longitude).subscribe({
          next: (stories) => {
            this.groups.set(groupByProfessional(stories));
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
      },
      () => this.loading.set(false),
    );
  }

  openGroup(index: number) {
    this.viewingGroupIndex.set(index);
    this.viewingStoryIndex.set(0);
  }

  closeViewer() {
    this.viewingGroupIndex.set(null);
  }

  prevStory() {
    if (this.hasPrev()) this.viewingStoryIndex.update((i) => i - 1);
  }

  nextStory() {
    if (this.hasNext()) this.viewingStoryIndex.update((i) => i + 1);
  }
}
