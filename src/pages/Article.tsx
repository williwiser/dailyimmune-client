import Container from "@/layouts/Container";
import Header from "@/layouts/Header";
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

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

interface Testimony {
  id: string;
  title: string;
  authorId: string;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
  thumbnail?: string;
  likes: number;
  user: User;
  likedByUser: boolean;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Article = () => {
  const params = useParams();
  const id = params.id;
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [testimony, setTestimony] = useState<Testimony>({
    id: "",
    title: "",
    authorId: "",
    body: "",
    likes: 0,
    createdAt: undefined,
    user: { id: "", firstName: "", lastName: "" },
    likedByUser: false,
  });

  const [favorite, setFavorite] = useState(false);
  const isLoggedIn = user !== null;

  console.log(`isLoggedIn: ${isLoggedIn}`);

  useEffect(() => {
    if (isLoggedIn)
      axios
        .get(`${BACKEND_URL}/api/v1/testimonies/${id}`, {
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
      axios
        .patch(
          `${BACKEND_URL}/api/v1/testimonies/${id}/${
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
      .get(`${BACKEND_URL}/api/v1/testimonies/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setTestimony(response.data);
      });
  }, [id, testimony, liked]);
  console.log(testimony.thumbnail);
  return (
    <div>
      <Toaster />
      <Header
        title=""
        className={`bg-[url("${testimony.thumbnail}")] bg-stone-100 bg-cover h-56`}
      />
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
                <BreadcrumbPage>Testimony</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col md:flex-row justify-between md:items-center w-full gap-4">
            <div className="flex flex-col gap-4">
              <h1 className="playfair-display-600 text-5xl">
                {testimony.title}
              </h1>
              <p className="text-gray-500 italic">
                {`by ${testimony.user.firstName} ${testimony.user.lastName} • ${
                  testimony.createdAt
                    ? new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(testimony.createdAt))
                    : ""
                }`}
              </p>
            </div>
            <div className="flex gap-3">
              {isLoggedIn && user.id === testimony.user.id ? (
                <Link
                  to={`/dashboard/testimonies/${testimony.id}/edit`}
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
              <div className="flex gap-1 bg-gray-100 p-2 rounded-md">
                <motion.button
                  onClick={toggleLiked}
                  initial={false}
                  animate={{ scale: liked ? 1.2 : 1, rotate: liked ? 360 : 0 }}
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
                <span>
                  {testimony.likes} {testimony.likes === 1 ? "like" : "likes"}
                </span>
              </div>
            </div>
          </div>
          <hr className="my-4  border-gray-400" />
          <p className="text-gray-500 whitespace-pre-line">{testimony.body}</p>
        </article>
      </Container>
    </div>
  );
};

export default Article;
