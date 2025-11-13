import type User from "./User";

export default interface Event {
  id: string;
  title: string;
  description: string;
  additionalNotes: string;
  date: Date;
  host: User;
}
