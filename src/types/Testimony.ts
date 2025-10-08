import type User from "./User";

export default interface Testimony {
  id: string;
  title: string;
  body: string;
  thumbnail?: string;
  updatedAt: Date;
  user: User;
  status: string;
  // add other properties if needed
}
