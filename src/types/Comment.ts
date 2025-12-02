export interface Comment {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  postedBy: {
    id: string;
    profilePhoto?: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
