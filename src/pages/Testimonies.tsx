import SearchBar from "@/components/SearchBar";
import TestimonyCard from "@/components/TestimonyCard";
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
  const [testimonies, setTestimonies] = useState([]);
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(" ") + "...";
  };
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/testimonies`, { withCredentials: true })
      .then((response) => {
        setTestimonies(response.data);
      });
  }, []);
  console.log(testimonies);
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {testimonies.map((testimony: Testimony) => (
            <TestimonyCard
              key={testimony.id}
              id={parseInt(testimony.id)}
              thumbnail={testimony.thumbnail}
              title={testimony.title}
              body={truncateText(testimony.body, 15)}
              edited={testimony.updatedAt}
              author={`${testimony.user.firstName} ${testimony.user.lastName}`}
              status={testimony.status}
            />
          ))}
        </div>
      </Section>
    </>
  );
};

export default Testimonies;
