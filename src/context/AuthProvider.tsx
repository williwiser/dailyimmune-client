// components/AuthProvider.tsx
import { fetchUser } from "@/utils/fetchUser";
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "./auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const loggedInUser = await fetchUser();
      if (loggedInUser) setUser(loggedInUser);
    };
    fetchLoggedInUser();
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
