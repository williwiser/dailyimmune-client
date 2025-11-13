// components/AuthProvider.tsx
import { fetchUser } from "@/utils/fetchUser";
import { AuthContext } from "./AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface AuthProviderProps {
  children: React.ReactNode;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading: loading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const logout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.setQueryData(["user"], null); // 👈 ensures user is null immediately
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
