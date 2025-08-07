import TestimonyCard from "@/components/TestimonyCard";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState, type ChangeEvent } from "react";

type User = {
  id: string;
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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MySavedTestimonies = () => {
  const [testimonies, setTestimonies] = useState([]);
  const { user } = useAuth();
  console.log(user);
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    axios
      .get(
        `${BACKEND_URL}/api/v1/testimonies/search?q=${query}&page=1&limit=10`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setTestimonies(response.data);
      });
  };
  useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/testimonies?authorId=${user?.id}&page=1&limit=10`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setTestimonies(response.data);
      });
  }, [user?.id]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <div className=" lg:col-span-2">
        <div className="flex gap-4 items-center bg-white border rounded-md">
          <FontAwesomeIcon icon={faSearch} className="pl-4 text-gray-500" />
          <input
            type="text"
            className="w-full pr-4 py-2"
            placeholder="Search testimonies..."
            onChange={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {testimonies.length === 0 ? (
            <p className="text-gray-500 px-4">No saved testimonies</p>
          ) : (
            testimonies.map((testimony: Testimony) => (
              <div className="flex justify-center">
                <TestimonyCard
                  key={testimony.id}
                  id={testimony.id}
                  thumbnail={testimony.thumbnail}
                  title={testimony.title}
                  body={truncateText(testimony.body, 15)}
                  edited={testimony.updatedAt}
                  author={`${testimony.user.firstName} ${testimony.user.lastName}`}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MySavedTestimonies;
