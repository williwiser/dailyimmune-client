import axios from "axios";

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchUser = async () => {
  const response = await axios.get(`${BACKEND_URL}/api/v1/users/me`, {
    withCredentials: true,
  });
  return response.data;
};
