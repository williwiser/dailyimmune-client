import Container from "@/layouts/Container";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { motion } from "framer-motion";
import { Edit, Heart, Star, User } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Link, useParams } from "react-router";
import { useAuth } from "@/context/useAuth";
import Loader from "@/components/Loader";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
}

interface Devotional {
  id: string;
  title: string;
  authorId: string;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
  thumbnail?: string;
  likes: number;
  author: User;
  likedByUser: boolean;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const DevotionalArticle = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const id = params.id;
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [devotional, setDevotional] = useState<Devotional>({
    id: "",
    title: "",
    authorId: "",
    body: "",
    likes: 0,
    thumbnail: "",
    createdAt: undefined,
    author: { id: "", firstName: "", lastName: "" },
    likedByUser: false,
  });

  const [favorite, setFavorite] = useState(false);
  const isLoggedIn = user !== null;

  console.log(`isLoggedIn: ${isLoggedIn}`);

  useEffect(() => {
    if (isLoggedIn)
      axios
        .get(`${BACKEND_URL}/api/v1/devotional/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setLiked(response.data.likedByUser);
        });
  }, [id, isLoggedIn]);

  const toggleFavorite = () => {
    if (isLoggedIn) {
      setFavorite((prev) => !prev);
      if (!favorite) {
        toast("Added to favorites!");
      } else {
        toast("Removed from favorites");
      }
    } else {
      toast("You must be logged in to save posts.");
    }
  };

  const toggleLiked = () => {
    if (isLoggedIn) {
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev - 1 : prev + 1));
      axios
        .patch(
          `${BACKEND_URL}/api/v1/devotionals/${id}/${
            liked ? "unlike" : "like"
          }`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          setLiked((prev) => !prev);
        });
    } else {
      toast("You must be logged in to like posts.");
    }
  };
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/devotionals/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setIsLoading(false);
        setDevotional(response.data);
        setLikes(devotional.likes);
      });
  }, [id, devotional.likes]);
  console.log(devotional.thumbnail);
  return (
    <div>
      <Toaster />
      <header
        className={`bg-stone-100 bg-cover h-56`}
        style={{
          backgroundImage: `url('${devotional.thumbnail}')`,
          backgroundSize: "cover",
        }}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <article className="py-8">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Devotional</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-col md:flex-row justify-between md:items-center w-full gap-4">
              <div className="flex flex-col gap-4">
                <h1 className="playfair-display-600 text-5xl">
                  {devotional.title}
                </h1>
                <p className="text-gray-500 italic">
                  {`by ${devotional.author.firstName} ${
                    devotional.author.lastName
                  } • ${
                    devotional.createdAt
                      ? new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(devotional.createdAt))
                      : ""
                  }`}
                </p>
              </div>
              <div className="flex gap-3">
                {isLoggedIn && user.id === devotional.author.id ? (
                  <Link
                    to={`/dashboard/testimonies/${devotional.id}/edit`}
                    className="p-2"
                  >
                    <Edit />
                  </Link>
                ) : null}
                <button className="cursor-pointer" onClick={toggleFavorite}>
                  <Star
                    fill={favorite ? "#DAA520" : "transparent"}
                    color={favorite ? "#DAA520" : "#000"}
                    className="transition-all duration-300 fade-in-10 checked:scale-110"
                  />
                </button>
                <div className="flex gap-2 bg-gray-100 p-2 rounded-md">
                  <motion.button
                    onClick={toggleLiked}
                    initial={false}
                    animate={{
                      scale: liked ? 1.2 : 1,
                      rotate: liked ? 360 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <Heart
                      fill={liked ? "#DC143C" : "transparent"}
                      color={liked ? "#DC143C" : "#000"}
                      className="transition-all duration-300 fade-in-10 checked:scale-110"
                    />
                  </motion.button>{" "}
                  <span className="text-gray-500">{likes}</span>
                </div>
              </div>
            </div>
            <hr className="my-4  border-gray-400" />
            <p className="text-gray-500 whitespace-pre-line">
              {devotional.body}
            </p>
          </article>
        </Container>
      )}
    </div>
  );
};

export default DevotionalArticle;
