import type User from "./User";

export default interface Devotional {
  id: string;
  title: string;
  body: string;
  verse: string;
  reference: string;
  preview: string;
  theme?: string;
  readTime: string;
  thumbnail?: string;
  updatedAt: Date;
  author: User;
  status: string;
}
