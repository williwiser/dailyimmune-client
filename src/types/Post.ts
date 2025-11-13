import type User from "./User";

interface PrayerRequestMeta {
  isAnswered: boolean;
  isPublic: boolean;
}

interface DevotionalMeta {
  thumbnail?: string;
}

interface TestimonyMeta {
  thumbnail?: string;
}

interface AudioMeta {
  url: string;
}

interface VideoMeta {
  url: string;
}

interface MetaMap {
  testimony: TestimonyMeta;
  devotional: DevotionalMeta;
  prayerRequest: PrayerRequestMeta;
  video: VideoMeta;
  audio: AudioMeta;
}

export default interface Post<T extends keyof MetaMap> {
  id: string;
  title: string;
  body: string;
  type: string;
  preview: string;
  authorId: string;
  likes: number;
  saves: number;
  isLiked: T extends "testimony"
    ? boolean
    : T extends "devotional"
    ? boolean
    : undefined;
  isSaved: T extends "testimony"
    ? boolean
    : T extends "devotional"
    ? boolean
    : undefined;
  createdAt: Date;
  updatedAt: Date;
  author: Omit<User, "id">;
  status: string;
  meta: MetaMap[T];
}
