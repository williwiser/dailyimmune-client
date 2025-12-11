import type User from "./User";

interface PrayerRequestMeta {
  isAnswered: boolean;
  isPublic: boolean;
  thumbnail?: string;
}

interface ArticleMeta {
  thumbnail?: string;
}

interface AudioMeta {
  url: string;
  thumbnail?: string;
}

interface VideoMeta {
  url: string;
  thumbnail?: string;
}

interface MetaMap {
  article: ArticleMeta;
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
  isLiked: T extends "article" ? boolean : undefined;
  isSaved: T extends "article" ? boolean : undefined;
  createdAt: Date;
  updatedAt: Date;
  author: Omit<User, "id">;
  status: string;
  meta: MetaMap[T];
}
