import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/useAuth";
import type Post from "@/types/Post";
import { slugify } from "@/utils/slugify";
import {
  faBookmark,
  faCopy,
  faHeart,
  faHeartCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { motion } from "framer-motion";
import { Bookmark, Edit, Heart, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";
import { toast, Toaster } from "sonner";

type Testimony = Post<"testimony">;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock data for preview
const emptyPost: Testimony = {
  id: "",
  title: "",
  authorId: "",
  preview: "",
  type: "testimony",
  body: "",
  meta: {},
  likes: 0,
  saves: 0,
  isLiked: false,
  isSaved: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  author: {
    firstName: "",
    lastName: "",
    profilePhoto: "",
  },
  status: "pending",
};

const Article = () => {
  const { id } = useParams();
  const [testimony, setTestimony] = useState<Testimony>(emptyPost);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/posts/${id}`, { withCredentials: true })
      .then((response) => {
        setTestimony(response.data);
        setLikes(response.data.likes);
        setLiked(response.data.isLiked);
        setSaved(response.data.isSaved);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleShare = () => {
    let shareUrl = "";
    if (navigator.share) {
      navigator
        .share({
          title: testimony.title,
          text: `Read this post: ${testimony.title}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      if (testimony.type === "testimony") {
        shareUrl = `${window.location.origin}/testimonies/${
          testimony.id
        }/${slugify(testimony.title)}`;
      } else if (testimony.type === "devotional") {
        shareUrl = `${window.location.origin}/devotionals/${
          testimony.id
        }/${slugify(testimony.title)}`;
      }

      navigator.clipboard
        .writeText(shareUrl)
        .then(() =>
          toast("Link copied to clipboard!", {
            icon: <FontAwesomeIcon icon={faCopy} />,
          })
        )
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  const toggleSaved = () => {
    if (!user) {
      toast.error("You must be logged in to save posts");
      return;
    }
    setSaved((prev) => !prev);

    if (saved) {
      toast("Post removed from saves", {
        icon: <FontAwesomeIcon icon={faBookmark} />,
      });
      axios.delete(`${BACKEND_URL}/api/v1/posts/${id}/unsave`, {
        withCredentials: true,
      });
    } else {
      toast("You saved this post!", {
        icon: <FontAwesomeIcon icon={faBookmark} />,
      });
      axios.post(
        `${BACKEND_URL}/api/v1/posts/${id}/save`,
        {},
        {
          withCredentials: true,
        }
      );
    }
  };

  const toggleLiked = () => {
    if (!user) {
      toast.error("You must be logged in to like posts");
      return;
    }

    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    if (liked) {
      toast("Post removed from likes", {
        icon: <FontAwesomeIcon icon={faHeartCircleMinus} />,
      });
      axios.delete(`${BACKEND_URL}/api/v1/posts/${id}/unlike`, {
        withCredentials: true,
      });
    } else {
      toast("You liked this post!", {
        icon: <FontAwesomeIcon icon={faHeart} />,
      });
      axios.post(
        `${BACKEND_URL}/api/v1/posts/${id}/like`,
        {},
        {
          withCredentials: true,
        }
      );
    }
  };

  return isLoading ? (
    <main className="flex h-screen justify-center items-center">
      <PulseLoader color="#79716b" />
    </main>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster />
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `url('${
              testimony.meta.thumbnail || "/placeholder.jpg"
            }')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white" />

        {/* Floating Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          {user && user.id === testimony.authorId && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Link
                to={`/dashboard/${
                  testimony.type === "devotional"
                    ? "devotionals"
                    : "testimonies"
                }/${testimony.id}/edit`}
              >
                <Edit className="w-5 h-5 text-gray-700" />
              </Link>
            </motion.button>
          )}
          <motion.button
            onClick={toggleSaved}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Bookmark
              fill={saved ? "#DAA520" : "transparent"}
              className={`w-5 h-5 transition-colors ${
                saved ? "text-amber-500" : "text-gray-700"
              }`}
            />
          </motion.button>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <article className="bg-white rounded-2xl border overflow-hidden">
          {/* Header Section */}
          <div className="p-8 md:p-12 border-b border-gray-100">
            <span className="text-stone-500 uppercase text-sm bg-gray-100 px-4 py-2 rounded-full">
              {testimony.type}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight mt-8">
              {testimony.title}
            </h1>

            {/* Author & Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="cursor-pointer border">
                  <AvatarImage
                    src={testimony.author.profilePhoto}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {testimony.author.firstName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {testimony.author.firstName} {testimony.author.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(testimony.createdAt))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Like Button */}
              <motion.button
                onClick={toggleLiked}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors shadow-sm"
              >
                <motion.div
                  animate={{
                    scale: liked ? [1, 1.3, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <Heart
                    fill={liked ? "#DC143C" : "transparent"}
                    className={`w-6 h-6 transition-colors ${
                      liked ? "text-red-500" : "text-gray-400"
                    }`}
                  />
                </motion.div>
                <span className="text-lg font-semibold text-gray-700">
                  {likes}
                </span>
              </motion.button>
            </div>
          </div>

          {/* Article Body */}
          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {testimony.body.split("\n\n").map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-700 leading-relaxed mb-6 text-lg whitespace-pre-line"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Footer Section */}
          <div className="p-8 md:p-12 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-600">Did you find this inspiring?</p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="cursor-pointer px-6 py-2 bg-white border border-gray-200 rounded-full font-medium text-gray-700 hover:border-gray-300 transition-colors"
                >
                  Share
                </motion.button>
                <Link
                  to={
                    testimony.type === "devotional"
                      ? "/devotionals"
                      : "/testimonies"
                  }
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer px-6 py-2 bg-gradient-to-r from-stone-500 to-stone-600 text-white rounded-full font-medium hover:shadow-md transition-shadow"
                  >
                    Read More Stories
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related or Additional Content Placeholder */}
        <div className="mt-12 mb-16 text-center text-gray-500">
          <p className="text-sm">More amazing posts coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Article;
