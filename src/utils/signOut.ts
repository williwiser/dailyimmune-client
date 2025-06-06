import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const signOut = async () => {
  const response = await axios.post(`${BACKEND_URL}/api/v1/auth/logout`, {
    withCredentials: true,
  });
  if (response.status !== 200) return null;
  return response.data;
};
