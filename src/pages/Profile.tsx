import Container from "@/layouts/Container";
import Header from "@/layouts/Header";
import Section from "@/layouts/Section";
import axios from "axios";
import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    profilePhoto: "",
    createdAt: new Date(),
  });
  const [joined, setJoined] = useState("");
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/users/me`, { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setJoined(
          new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(response.data.createdAt))
        );
      });
  }, []);
  return (
    <div>
      <Header
        title="Profile"
        desc="Manage your profile, testimonies, and messages"
        className="bg-stone-100 bg-cover"
      />
      <header>
        <Container>
          <div className="flex items-center gap-4">
            <img
              src="/placeholder.jpg"
              className="size-36 rounded-full "
              alt="profile photo"
            />
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{`${user?.firstName} ${user?.lastName}`}</h1>
              <p className="text-gray-500 italic">{`Joined ${joined}`}</p>
            </div>
          </div>
        </Container>
      </header>
      <Section className="bg-stone-100"></Section>
    </div>
  );
};

export default Profile;
