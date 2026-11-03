export type StoryType = 'PRESENTATION' | 'TIPS' | 'LIVE';

export interface Story {
  id: string;
  professionalProfileId: string;
  type: StoryType;
  videoKey: string;
  thumbnailKey: string | null;
  durationSeconds: number;
  createdAt: string;
  expiresAt: string;
}

export interface StoryFeedItem {
  id: string;
  type: StoryType;
  createdAt: string;
  professionalProfileId: string;
  companyName: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  avatarUrl: string | null;
}

export interface StoryGroup {
  professionalProfileId: string;
  companyName: string;
  avatarUrl: string | null;
  stories: StoryFeedItem[];
}

export interface StoryViewerItem {
  createdAt: string;
}
