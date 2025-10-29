import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import ReactPlayer from "react-player";
import { Link } from "react-router";
import { slugify } from "@/utils/slugify";
import {
  Bookmark,
  BookmarkMinusIcon,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faCheckCircle,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import PulseLoader from "react-spinners/PulseLoader";
import { PrayerModal } from "./PrayerModal";

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
    caption?: string;
    url?: string;
  };
  isSaved?: boolean;
};

const FeedList = () => {
  const [feed, setFeed] = useState<FeedActivity[]>([]);
  const [page, setPage] = useState(1);
  const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});
  const [savedItems, setSavedItems] = useState<{ [key: string]: boolean }>({});
  const [activePrayerId, setActivePrayerId] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Helper Functions
  const toggleLike = (id: string) => {
    setLikedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle this specific item
    }));
    console.log(likedItems);
  };

  const toggleSaved = async (activity: FeedActivity) => {
    let activityRoute = "";
    switch (activity.type) {
      case "testimony":
        activityRoute = "testimonies";
        break;
      case "devotional":
        activityRoute = "devotionals";
        break;
      case "event":
        activityRoute = "events";
        break;
      default:
        activityRoute = "";
        break;
    }
    setSavedItems((prev) => ({
      ...prev,
      [activity.id]: !prev[activity.id], // Toggle this specific item
    }));

    if (savedItems[activity.id]) {
      toast("Post removed to favorites", {
        icon: <FontAwesomeIcon icon={faBookmark} />,
      });
      await axios.post(
        `${BACKEND_URL}/api/v1/${activityRoute}/${
          activity.id.split("-")[1]
        }/unsave`,
        {},
        { withCredentials: true }
      );
    } else {
      toast("Post added to favorites!", {
        icon: <FontAwesomeIcon icon={faBookmark} />,
      });
      await axios.post(
        `${BACKEND_URL}/api/v1/${activityRoute}/${
          activity.id.split("-")[1]
        }/save`,
        {},
        { withCredentials: true }
      );
    }
  };

  const handleShare = (item: FeedActivity) => {
    let shareUrl = "";
    if (navigator.share) {
      navigator
        .share({
          title: item.content,
          text: `Read this post: ${item.content}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      if (item.type === "testimony") {
        shareUrl = `${window.location.origin}/testimonies/${
          item.id.split("-")[1]
        }/${slugify(item.content)}`;
      } else if (item.type === "devotional") {
        shareUrl = `${window.location.origin}/devotionals/${
          item.id.split("-")[1]
        }/${slugify(item.content)}`;
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

  const renderActivity = (activity: FeedActivity) => {
    switch (activity.type) {
      case "testimony":
        return (
          <div className="flex flex-col py-6">
            <div className="flex gap-2 items-center mb-4">
              <Avatar className="border">
                <AvatarImage
                  src={activity.authorPhoto}
                  className="object-cover"
                />
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
            <span className="bg-gray-100 text-stone-500 text-sm mb-2 w-fit px-4 py-0.5 rounded-full">
              &bull; Testimony
            </span>
            <Link
              to={`/testimonies/${activity.id.split("-")[1]}/${slugify(
                activity.content
              )}`}
              className="font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-2 text-wrap"
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
                onClick={() => toggleSaved(activity)}
                className={`cursor-pointer ${
                  savedItems[activity.id] ? "text-yellow-400" : "text-gray-400"
                } hover:text-yellow-500  transition-all duration-200`}
              >
                {savedItems[activity.id] ? (
                  <BookmarkMinusIcon
                    size={16}
                    fill={
                      savedItems[activity.id]
                        ? "oklch(85.2% 0.199 91.936)"
                        : "none"
                    }
                    className="inline"
                  />
                ) : (
                  <Bookmark
                    size={16}
                    fill={
                      savedItems[activity.id]
                        ? "oklch(85.2% 0.199 91.936)"
                        : "none"
                    }
                    className="inline"
                  />
                )}
                <span className="text-sm">
                  {" "}
                  {savedItems[activity.id] ? "Unsave" : "Save"}
                </span>
              </button>

              <button
                onClick={() => handleShare(activity)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-200"
              >
                <Share2 size={16} className="inline" />
                <span className="text-sm"> Share</span>
              </button>
            </div>
          </div>
        );
      case "devotional":
        return (
          <div className="flex flex-col py-6">
            <div className="flex gap-2 items-center mb-4">
              <Avatar className="border">
                <AvatarImage
                  src={activity.authorPhoto}
                  className="object-cover"
                />
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
            <span className="bg-gray-100 text-stone-500 text-sm mb-2 w-fit px-4 py-0.5 rounded-full">
              &bull; Devotional
            </span>
            <Link
              to={`/devotionals/${activity.id.split("-")[1]}/${slugify(
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
                onClick={() => toggleSaved(activity)}
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

              <button
                onClick={() => handleShare(activity)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-200"
              >
                <Share2 size={16} className="inline" />
                <span className="text-sm"> Share</span>
              </button>
            </div>
          </div>
        );
      case "prayerRequest":
        return (
          <div className="flex flex-col py-6">
            <PrayerModal
              id={activePrayerId ? activePrayerId : ""}
              open={showModal}
              onOpenChange={setShowModal}
            />
            <div className="flex gap-2 items-center mb-4">
              <Avatar className="border">
                <AvatarImage
                  src={activity.authorPhoto}
                  className="object-cover"
                />
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
            <span className="bg-gray-100 text-stone-500 text-sm mb-2 w-fit px-4 py-0.5 rounded-full">
              &bull; Prayer Request
            </span>
            <button
              className="p-0 w-fit hover:no-underline cursor-pointer font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-2 text-wrap text-left"
              onClick={() => {
                setActivePrayerId(activity.id.split("-")[1]);
                setShowModal(true);
              }}
            >
              {activity.content}
            </button>
            <p className="text-gray-500 mb-4">{activity.extra?.body}</p>
            {activity.thumbnail && (
              <img
                src={activity.thumbnail}
                className="w-full h-56 object-cover rounded-sm"
              />
            )}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setActivePrayerId(activity.id.split("-")[1]);
                  setShowModal(true);
                }}
                className={`cursor-pointer text-gray-400 hover:text-gray-800  transition-all duration-200`}
              >
                <Eye
                  size={16}
                  fill={likedItems[activity.id] ? "red" : "none"}
                  className="inline"
                />
                <span className="text-sm"> View</span>
              </button>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="flex flex-col py-6">
            <div className="flex gap-2 items-center mb-4">
              <Avatar className="border">
                <AvatarImage
                  src={activity.authorPhoto}
                  className="object-cover"
                />
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
                  <span className="italic">shared a video</span>
                </p>
                <p>
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <h1 className="p-0 w-fit hover:no-underline cursor-pointer font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-4 text-wrap text-left">
              {activity.content}
            </h1>
            <div className="flex justify-center items-center w-full">
              <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-lg">
                <ReactPlayer
                  src={activity.extra?.url}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            </div>

            <p className="text-gray-500 my-4">{activity.extra?.caption}</p>
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
                onClick={() => toggleSaved(activity)}
                className={`cursor-pointer ${
                  savedItems[activity.id] ? "text-yellow-400" : "text-gray-400"
                } hover:text-yellow-500  transition-all duration-200`}
              >
                {savedItems[activity.id] ? (
                  <BookmarkMinusIcon
                    size={16}
                    fill={
                      savedItems[activity.id]
                        ? "oklch(85.2% 0.199 91.936)"
                        : "none"
                    }
                    className="inline"
                  />
                ) : (
                  <Bookmark
                    size={16}
                    fill={
                      savedItems[activity.id]
                        ? "oklch(85.2% 0.199 91.936)"
                        : "none"
                    }
                    className="inline"
                  />
                )}
                <span className="text-sm">
                  {" "}
                  {savedItems[activity.id] ? "Unsave" : "Save"}
                </span>
              </button>

              <button
                onClick={() => handleShare(activity)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-200"
              >
                <Share2 size={16} className="inline" />
                <span className="text-sm"> Share</span>
              </button>
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="flex flex-col py-6">
            <div className="flex gap-2 items-center mb-4">
              <Avatar className="border">
                <AvatarImage
                  src={activity.authorPhoto}
                  className="object-cover"
                />
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
                  <span className="italic">shared an audio</span>
                </p>
                <p>
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <h1 className="p-0 w-fit hover:no-underline cursor-pointer font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-4 text-wrap text-left">
              {activity.content}
            </h1>
            <div className="flex justify-center items-center w-full">
              <audio
                src={activity.extra?.url}
                controls
                className="w-full h-10 rounded-full"
              />
            </div>

            <p className="text-gray-500 my-4">{activity.extra?.caption}</p>
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
                onClick={() => toggleSaved(activity)}
                className={`cursor-pointer ${
                  savedItems[activity.id] ? "text-yellow-400" : "text-gray-400"
                } hover:text-yellow-500  transition-all duration-200`}
              >
                {savedItems[activity.id] ? (
                  <BookmarkMinusIcon
                    size={16}
                    fill={
                      savedItems[activity.id]
                        ? "oklch(85.2% 0.199 91.936)"
                        : "none"
                    }
                    className="inline"
                  />
                ) : (
                  <Bookmark
                    size={16}
                    fill={
                      savedItems[activity.id]
                        ? "oklch(85.2% 0.199 91.936)"
                        : "none"
                    }
                    className="inline"
                  />
                )}
                <span className="text-sm">
                  {" "}
                  {savedItems[activity.id] ? "Unsave" : "Save"}
                </span>
              </button>

              <button
                onClick={() => handleShare(activity)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-200"
              >
                <Share2 size={16} className="inline" />
                <span className="text-sm"> Share</span>
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
                onClick={() => toggleSaved(activity)}
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

                <span className="text-sm">
                  {" "}
                  {savedItems[activity.id] ? "Unsave" : "Save"}
                </span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    feed.forEach((activity: FeedActivity) => {
      if (activity.isSaved) {
        setSavedItems((prev) => ({
          ...prev,
          [activity.id]: !prev[activity.id], // Toggle this specific item
        }));
      }
    });
  }, [feed]);
  useEffect(() => {
    const fetchFeed = async () => {
      const url = new URL(`${BACKEND_URL}/api/v1/feed`);
      url.searchParams.set("limit", "7");
      if (cursor) url.searchParams.set("cursor", cursor);

      try {
        const response = await axios.get(url.toString(), {
          withCredentials: true,
        });

        const items: FeedActivity[] = response.data.items || response.data;
        const nextCursor = response.data.nextCursor;

        if (!items.length) {
          setHasMore(false);
          return;
        }

        setFeed((prev) => {
          const newItems = items.filter(
            (item) => !prev.some((p) => p.id === item.id)
          );
          return [...prev, ...newItems];
        });

        setCursor(nextCursor ?? null);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFeed();
  }, [cursor, hasMore, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore]);

  return (
    <div className="p-6 md:rounded-md border bg-white">
      <div className="flex items-center mb-3">
        <Clock className="w-6 h-6 mr-3 text-[#747474]" />
        <h2 className="text-xl font-bold text-[#3b3b19]">
          Recent Community Activity
        </h2>
      </div>
      {feed.length === 0 ? (
        <p className="text-center p-4 mt-4 bg-gray-50 text-gray-500 rounded-md border">
          No recent activity
        </p>
      ) : (
        feed.map((activity: FeedActivity) => (
          <>
            {renderActivity(activity)}
            {activity.type !== "event" && <hr />}
          </>
        ))
      )}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center items-center p-12">
          <PulseLoader color="#79716b" />
        </div>
      )}
    </div>
  );
};

export default FeedList;
