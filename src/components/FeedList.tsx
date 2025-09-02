import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Link } from "react-router";
import { slugify } from "@/utils/slugify";
import { Bookmark, Calendar, Clock, Heart, Share2, User } from "lucide-react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faCheckCircle,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type FeedActivity = {
  id: string;
  type: string;
  authorName: string;
  authorPhoto?: string;
  authorId: string;
  authorRole: string;
  createdAt: string;
  content: string;
  thumbnail?: string;
  extra?: {
    body?: string;
    isAnswered?: boolean;
    date?: Date;
  };
};

const FeedList = () => {
  const [feed, setFeed] = useState<FeedActivity[]>([]);
  const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});
  const [savedItems, setSavedItems] = useState<{ [key: string]: boolean }>({});

  // Helper Functions
  const toggleLike = (id: string) => {
    setLikedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle this specific item
    }));
    console.log(likedItems);
  };

  const toggleSaved = async (id: string) => {
    setSavedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle this specific item
    }));
    console.log(savedItems);
    if (savedItems[id]) {
      toast("Post removed to favorites", {
        icon: <FontAwesomeIcon icon={faBookmark} />,
      });
    } else {
      toast("Post added to favorites!", {
        icon: <FontAwesomeIcon icon={faBookmark} />,
      });
      await axios.post(
        `${BACKEND_URL}/api/v1/testimonies/${id.split("-")[1]}/save`,
        {},
        { withCredentials: true }
      );
    }
  };

  const handleShare = (item: FeedActivity) => {
    if (navigator.share) {
      navigator
        .share({
          title: item.content,
          text: `Read this testimony: ${item.content}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      const shareUrl = `${window.location.origin}/testimonies/${
        item.id.split("-")[1]
      }/${slugify(item.content)}`;

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

  const renderActivity = (activity: FeedActivity) => {
    switch (activity.type) {
      case "testimony":
        return (
          <div className="flex flex-col py-6">
            <div className="flex gap-2 items-center mb-4">
              <Avatar className="border">
                <AvatarImage src={activity.authorPhoto} />
                <AvatarFallback>{activity.authorName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-gray-500 text-sm">
                <Link
                  to={`/profile/${activity.authorId}`}
                  className="font-semibold flex items-center gap-2"
                >
                  <span>{activity.authorName} </span>{" "}
                  {(activity.authorRole === "SUPERADMIN" ||
                    activity.authorRole === "ADMIN") && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500"
                    />
                  )}
                </Link>
                <p>
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <Link
              to={`/testimonies/${activity.id.split("-")[1]}/${slugify(
                activity.content
              )}`}
              className="font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-2"
            >
              {activity.content}
            </Link>
            <p className="text-gray-500 mb-4">{activity.extra?.body}</p>
            {activity.thumbnail && (
              <img
                src={activity.thumbnail}
                className="w-full h-56 object-cover rounded-sm"
              />
            )}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => toggleLike(activity.id)}
                className={`cursor-pointer ${
                  likedItems[activity.id] ? "text-red-500" : "text-gray-400"
                } hover:text-red-600  transition-all duration-200`}
              >
                <Heart
                  size={16}
                  fill={likedItems[activity.id] ? "red" : "none"}
                  className="inline"
                />
                <span className="text-sm"> Like</span>
              </button>
              <button
                onClick={() => toggleSaved(activity.id)}
                className={`cursor-pointer ${
                  savedItems[activity.id] ? "text-yellow-400" : "text-gray-400"
                } hover:text-yellow-500  transition-all duration-200`}
              >
                <Bookmark
                  size={16}
                  fill={
                    savedItems[activity.id]
                      ? "oklch(85.2% 0.199 91.936)"
                      : "none"
                  }
                  className="inline"
                />
                <span className="text-sm"> Save</span>
              </button>
              {activity.type === "testimony" ? (
                <button
                  onClick={() => handleShare(activity)}
                  className="cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-200"
                >
                  <Share2 size={16} className="inline" />
                  <span className="text-sm"> Share</span>
                </button>
              ) : null}
            </div>
          </div>
        );
      case "prayerRequest":
        return (
          <div className="flex flex-col py-6">
            <div className="flex gap-2 items-center mb-4">
              <Avatar className="border">
                <AvatarImage src={activity.authorPhoto} />
                <AvatarFallback>{activity.authorName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-gray-500 text-sm">
                <p>
                  <Link
                    to={`/profile/${activity.authorId}`}
                    className="font-semibold"
                  >
                    {activity.authorName}
                  </Link>{" "}
                  <span className="italic">submitted a prayer request</span>
                </p>
                <p>
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-xs">PRAYER REQUEST</p>
            <Link
              to={`/testimonies/${activity.id.split("-")[1]}/${slugify(
                activity.content
              )}`}
              className="font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-2"
            >
              {activity.content}
            </Link>
            <p className="text-gray-500 mb-4">{activity.extra?.body}</p>
            {activity.thumbnail && (
              <img
                src={activity.thumbnail}
                className="w-full h-56 object-cover rounded-sm"
              />
            )}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => toggleLike(activity.id)}
                className={`cursor-pointer ${
                  likedItems[activity.id] ? "text-red-500" : "text-gray-400"
                } hover:text-red-600  transition-all duration-200`}
              >
                <Heart
                  size={16}
                  fill={likedItems[activity.id] ? "red" : "none"}
                  className="inline"
                />
                <span className="text-sm"> Praying for you</span>
              </button>
            </div>
          </div>
        );
      case "event":
        return (
          <div className="flex flex-col p-6 bg-gradient-to-b from-gray-200/50 to to-gray-100/50 rounded-md">
            <span className="text-xs text-blue-500 bg-blue-200 w-fit px-2 py-1 rounded-full border border-blue-100 mb-3">
              UPCOMING EVENT
            </span>

            <Link
              to={`/events/${activity.id.split("-")[1]}`}
              className="inline-flex items-center gap-2 font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-3"
            >
              <Calendar />
              {activity.content}
            </Link>
            <div className="bg-stone-100 py-4 px-6 rounded-md w-fit mb-3 border">
              <div className="flex gap-2 items-center mb-1">
                <User size={18} />
                <span className="text-sm text-gray-500 italic">
                  hosted by {activity.authorName}
                </span>
              </div>
              {activity.extra?.date && (
                <div className="flex gap-2">
                  <Calendar size={18} />
                  <span className="text-sm text-gray-500">
                    {new Date(activity.extra.date).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-500 mb-4">{activity.extra?.body}</p>
            {activity.thumbnail && (
              <img
                src={activity.thumbnail}
                className="w-full h-56 object-cover rounded-sm"
              />
            )}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => toggleSaved(activity.id)}
                className={`cursor-pointer ${
                  savedItems[activity.id] ? "text-yellow-400" : "text-gray-400"
                } hover:text-yellow-500  transition-all duration-200`}
              >
                <Bookmark
                  size={16}
                  fill={
                    savedItems[activity.id]
                      ? "oklch(85.2% 0.199 91.936)"
                      : "none"
                  }
                  className="inline"
                />

                <span className="text-sm"> Save</span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/feed?page=1&limit=7`).then((response) => {
      setFeed(response.data);
    });
  }, []);

  return (
    <div className="p-6 rounded-md border bg-white">
      <div className="flex items-center mb-3">
        <Clock className="w-6 h-6 mr-3 text-[#747474]" />
        <h2 className="text-xl font-bold text-[#3b3b19]">
          Recent Community Activity
        </h2>
      </div>
      {feed.map((activity: FeedActivity) => (
        <>
          {renderActivity(activity)}
          {activity.type !== "event" && <hr />}
        </>
      ))}
    </div>
  );
};

export default FeedList;
