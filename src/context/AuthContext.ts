// contexts/AuthContext.ts
import { createContext } from "react";
import type { AuthContextType } from "./auth";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});
