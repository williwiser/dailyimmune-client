import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Container from "@/layouts/Container";
import Header from "@/layouts/Header";
import Section from "@/layouts/Section";
import axios from "axios";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false);
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
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <Container>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative">
                  <Avatar className="cursor-pointer size-36 rounded-full border">
                    <AvatarImage src={user?.profilePhoto} />
                    <AvatarFallback className="text-5xl text-gray-500">
                      {user?.firstName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <button className="absolute bg-gray-700 rounded-full bottom-0 right-0 p-2 hover:bg-gray-500 duration-200 transition-all cursor-pointer">
                    <Edit2 color="white" />
                  </button>
                </div>
                <div className="flex flex-col text-center md:text-left gap-2">
                  <h1 className="text-3xl font-bold">{`${user?.firstName} ${user?.lastName}`}</h1>
                  <p className="text-gray-500 italic">{`Joined ${joined}`}</p>
                </div>
              </div>
            </Container>
          </header>
          <Section className="bg-stone-100"></Section>
        </>
      )}
    </div>
  );
};

export default Profile;
