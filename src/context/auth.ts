// types/auth.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  role: string;
  bio: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  refetchUser: () => void;
  logout: () => void;
}
