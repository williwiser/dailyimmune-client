import SearchBar from "@/components/SearchBar";
import TestimonyCard from "@/components/TestimonyCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Header from "@/layouts/Header";
import Section from "@/layouts/Section";
import axios from "axios";
import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type User = {
  firstName: string;
  lastName: string;
};
type Testimony = {
  id: string;
  title: string;
  body: string;
  thumbnail: string;
  updatedAt: Date;
  user: User;
  status: string;
  // add other properties if needed
};

const Testimonies = () => {
  const [newTestimonies, setNewTestimonies] = useState([]);
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(" ") + "...";
  };
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/testimonies?page=1&limit=24`, {
        withCredentials: true,
      })
      .then((response) => {
        setNewTestimonies(response.data);
      });
  }, []);

  return (
    <>
      <Header
        title="Testimonies"
        desc="Read powerful stories of how God is transforming lives in our community."
        className="bg-stone-100"
      >
        <div className="flex justify-center items-center">
          <SearchBar />
        </div>
      </Header>
      <Section>
        {newTestimonies.length === 0 ? null : (
          <div>
            <h2 className="text-2xl font-bold text-[#3b3b19] mb-4">
              New Testimonies
            </h2>
            <ScrollArea className="block  w-full overflow-y-visible">
              <div className="flex gap-6 w-max">
                {newTestimonies.map((testimony: Testimony) => (
                  <TestimonyCard
                    key={testimony.id}
                    id={testimony.id}
                    thumbnail={testimony.thumbnail}
                    title={testimony.title}
                    body={truncateText(testimony.body, 15)}
                    edited={testimony.updatedAt}
                    author={`${testimony.user.firstName} ${testimony.user.lastName}`}
                    status={testimony.status}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
      </Section>
    </>
  );
};

export default Testimonies;
