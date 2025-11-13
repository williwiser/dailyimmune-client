import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import ReactPlayer from "react-player";
import { Link } from "react-router";
import { slugify } from "@/utils/slugify";
import { Bookmark, Clock, Eye, Heart, Share2, User } from "lucide-react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCopy,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import PulseLoader from "react-spinners/PulseLoader";
import { PrayerModal } from "./PrayerModal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Meta {
  thumbnail?: string;
  url?: string;
  isAnswered?: boolean;
  isPublic?: boolean;
}

interface User {
  firstName: string;
  lastName: string;
  profilePhoto: string;
  role: string;
}
interface FeedItem {
  id: string;
  title: string;
  type: "testimony" | "devotional" | "prayerRequest" | "video" | "audio";
  preview: string;
  createdAt: string;
  authorId: string;
  likes: number;
  saves: number;
  isSaved: boolean;
  meta?: Meta;
  author: User;
}

const FeedList = () => {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [activePrayerId, setActivePrayerId] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Helper Functions
  const handleShare = (item: FeedItem) => {
    let shareUrl = "";
    if (navigator.share) {
      navigator
        .share({
          title: item.title,
          text: `Read this post: ${item.title}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      if (item.type === "testimony") {
        shareUrl = `${window.location.origin}/testimonies/${item.id}/${slugify(
          item.title
        )}`;
      } else if (item.type === "devotional") {
        shareUrl = `${window.location.origin}/devotionals/${item.id}/${slugify(
          item.title
        )}`;
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

  const renderActivity = (feedItem: FeedItem) => {
    switch (feedItem.type) {
      case "testimony":
        return (
          <div className="flex flex-col py-6">
            <div className="flex gap-2 items-center mb-4">
              <Avatar className="border">
                <AvatarImage
                  src={feedItem.author.profilePhoto}
                  className="object-cover"
                />
                <AvatarFallback>{feedItem.author.firstName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-gray-500 text-sm">
                <Link
                  to={`/profile/${feedItem.authorId}`}
                  className="font-semibold flex items-center gap-2"
                >
                  <span>
                    {feedItem.author.firstName} {feedItem.author.lastName}
                  </span>{" "}
                  {(feedItem.author.role === "SUPERADMIN" ||
                    feedItem.author.role === "ADMIN") && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500"
                    />
                  )}
                </Link>
                <p>
                  {formatDistanceToNow(new Date(feedItem.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <span className="bg-gray-100 text-stone-500 text-sm mb-2 w-fit px-4 py-0.5 rounded-full">
              &bull; Testimony
            </span>
            <Link
              to={`/testimonies/${feedItem.id}/${slugify(feedItem.title)}`}
              className="font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-2 text-wrap"
            >
              {feedItem.title}
            </Link>
            <p className="text-gray-500 mb-4">{feedItem.preview}...</p>
            {feedItem.meta?.thumbnail && (
              <img
                src={feedItem.meta.thumbnail}
                className="w-full h-56 object-cover rounded-sm"
              />
            )}
            <div className="flex gap-4 mt-4">
              <div className="flex gap-4 items-center">
                <div className="text-gray-400">
                  <Heart size={16} fill="none" className="inline" />
                  <span className="text-sm"> {feedItem.likes}</span>
                </div>
                <div className="text-gray-400">
                  <Bookmark size={16} fill="none" className="inline" />
                  <span className="text-sm"> {feedItem.saves}</span>
                </div>
              </div>

              <button
                onClick={() => handleShare(feedItem)}
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
                  src={feedItem.author.profilePhoto}
                  className="object-cover"
                />
                <AvatarFallback>{feedItem.author.firstName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-gray-500 text-sm">
                <Link
                  to={`/profile/${feedItem.authorId}`}
                  className="font-semibold flex items-center gap-2"
                >
                  <span>
                    {feedItem.author.firstName} {feedItem.author.lastName}
                  </span>
                  {(feedItem.author.role === "SUPERADMIN" ||
                    feedItem.author.role === "ADMIN") && (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500"
                    />
                  )}
                </Link>
                <p>
                  {formatDistanceToNow(new Date(feedItem.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <span className="bg-gray-100 text-stone-500 text-sm mb-2 w-fit px-4 py-0.5 rounded-full">
              &bull; Devotional
            </span>
            <Link
              to={`/devotionals/${feedItem.id}/${slugify(feedItem.title)}`}
              className="font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-2"
            >
              {feedItem.title}
            </Link>

            <p className="text-gray-500 mb-4">{feedItem.preview}...</p>
            {feedItem.meta?.thumbnail && (
              <img
                src={feedItem.meta.thumbnail}
                className="w-full h-56 object-cover rounded-sm"
              />
            )}
            <div className="flex gap-4 mt-4">
              <div className={`text-gray-400 transition-all duration-200`}>
                <Heart size={16} fill="none" className="inline" />
                <span className="text-sm"> {feedItem.likes}</span>
              </div>
              <div className="text-gray-400">
                <Bookmark size={16} fill="none" className="inline" />
                <span className="text-sm"> {feedItem.saves}</span>
              </div>

              <button
                onClick={() => handleShare(feedItem)}
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
                  src={feedItem.author.profilePhoto}
                  className="object-cover"
                />
                <AvatarFallback>{feedItem.author.firstName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-gray-500 text-sm">
                <p>
                  <Link
                    to={`/profile/${feedItem.authorId}`}
                    className="font-semibold"
                  >
                    {feedItem.author.firstName} {feedItem.author.lastName}
                  </Link>{" "}
                  <span className="italic">submitted a prayer request</span>
                </p>
                <p>
                  {formatDistanceToNow(new Date(feedItem.createdAt), {
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
                setActivePrayerId(feedItem.id);
                setShowModal(true);
              }}
            >
              {feedItem.title}
            </button>
            <p className="text-gray-500 mb-4">{feedItem.preview}</p>
            {feedItem.meta?.thumbnail && (
              <img
                src={feedItem.meta.thumbnail}
                className="w-full h-56 object-cover rounded-sm"
              />
            )}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  setActivePrayerId(feedItem.id);
                  setShowModal(true);
                }}
                className={`cursor-pointer text-gray-400 hover:text-gray-800  transition-all duration-200`}
              >
                <Eye size={16} className="inline" />
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
                  src={feedItem.author.profilePhoto}
                  className="object-cover"
                />
                <AvatarFallback>{feedItem.author.firstName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-gray-500 text-sm">
                <p>
                  <Link
                    to={`/profile/${feedItem.authorId}`}
                    className="font-semibold"
                  >
                    {feedItem.author.firstName} {feedItem.author.lastName}
                  </Link>{" "}
                  <span className="italic">shared a video</span>
                </p>
                <p>
                  {formatDistanceToNow(new Date(feedItem.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <h1 className="p-0 w-fit hover:no-underline cursor-pointer font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-4 text-wrap text-left">
              {feedItem.title}
            </h1>
            <div className="flex justify-center items-center w-full">
              <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden shadow-lg">
                <ReactPlayer
                  src={feedItem.meta?.url}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            </div>

            <p className="text-gray-500 my-4">{feedItem.preview}</p>
            <div className="flex gap-4 mt-4">
              <div className="text-gray-400">
                <Heart size={16} fill="none" className="inline" />
                <span className="text-sm"> {0}</span>
              </div>
              <div className="text-gray-400">
                <Bookmark size={16} fill="none" className="inline" />
                <span className="text-sm"> {0}</span>
              </div>

              <button
                onClick={() => handleShare(feedItem)}
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
                  src={feedItem.author.profilePhoto}
                  className="object-cover"
                />
                <AvatarFallback>{feedItem.author.firstName[0]}</AvatarFallback>
              </Avatar>
              <div className="text-gray-500 text-sm">
                <p>
                  <Link
                    to={`/profile/${feedItem.authorId}`}
                    className="font-semibold"
                  >
                    {feedItem.author.firstName} {feedItem.author.lastName}
                  </Link>{" "}
                  <span className="italic">shared an audio</span>
                </p>
                <p>
                  {formatDistanceToNow(new Date(feedItem.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <h1 className="p-0 w-fit hover:no-underline cursor-pointer font-bold text-3xl hover:text-gray-500 transition-all duration-200 mb-4 text-wrap text-left">
              {feedItem.title}
            </h1>
            <div className="flex justify-center items-center w-full">
              <audio
                src={feedItem.meta?.url}
                controls
                className="w-full h-10 rounded-full"
              />
            </div>

            <p className="text-gray-500 my-4">{feedItem.preview}</p>
            <div className="flex gap-4 mt-4">
              <div className="text-gray-400">
                <Heart size={16} fill="none" className="inline" />
                <span className="text-sm"> {0}</span>
              </div>
              <div className="text-gray-400">
                <Bookmark size={16} fill="none" className="inline" />
                <span className="text-sm"> {0}</span>
              </div>

              <button
                onClick={() => handleShare(feedItem)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-200"
              >
                <Share2 size={16} className="inline" />
                <span className="text-sm"> Share</span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchFeed = async () => {
      const url = new URL(`${BACKEND_URL}/api/v1/feed`);
      //if (cursor) url.searchParams.set("cursor", cursor);

      try {
        const response = await axios.get(url.toString(), {
          withCredentials: true,
        });

        const items: FeedItem[] = response.data.items || response.data;
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
        hasMore ? null : (
          <div className="text-center p-4 mt-4 bg-gray-50 text-gray-500 rounded-md border">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <FontAwesomeIcon
                icon={faNewspaper}
                className="text-3xl text-gray-400"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              No Recent Activity
            </h3>
          </div>
        )
      ) : (
        feed.map((feedItem: FeedItem) => (
          <>
            {renderActivity(feedItem)}
            <hr />
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
