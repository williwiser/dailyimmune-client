import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import ReactPlayer from "react-player";
import { Link, useLocation } from "react-router";
import { slugify } from "@/utils/slugify";
import { Bookmark, Clock, Eye, Heart, Share2, User } from "lucide-react";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
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
  type: "article" | "prayerRequest" | "video" | "audio";
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
  const [cursor, setCursor] = useState<string | null>(null);
  const [activePrayerId, setActivePrayerId] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const initialLoad = useRef(false);

  // Helper Functions
  const handleShare = (item: FeedItem) => {
    let shareUrl = "";
    if (navigator.share) {
      navigator
        .share({
          title: item.title,
          text: `Read this post: ${item.title}`,
          url: `${location.pathname.split("/")[0]}/posts/${item.id}/${slugify(
            item.title
          )}`,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      if (item.type === "article") {
        shareUrl = `${location.pathname.split("/")[0]}/posts/${
          item.id
        }/${slugify(item.title)}`;
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
      case "article":
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
              &bull; Article
            </span>
            <Link
              to={`/posts/${feedItem.id}/${slugify(feedItem.title)}`}
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

  const fetchFeed = async () => {
    try {
      const url = new URL(`${BACKEND_URL}/api/v1/feed`);
      url.searchParams.set("limit", "10");
      if (cursor) url.searchParams.set("cursor", cursor);

      const response = await axios.get(url.toString(), {
        withCredentials: true,
      });

      const { items, nextCursor, hasMore } = response.data;

      setFeed((prev) => [...prev, ...items]);
      setCursor(nextCursor);
      setHasMore(hasMore);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (initialLoad.current) return;
    initialLoad.current = true;
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 md:rounded-md border bg-white">
      <div className="flex items-center mb-3">
        <Clock className="w-6 h-6 mr-3 text-[#747474]" />
        <h2 className="text-xl font-bold text-[#3b3b19]">
          Recent Community Activity
        </h2>
      </div>

      <InfiniteScroll
        dataLength={feed.length}
        next={fetchFeed}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center p-12">
            <PulseLoader color="#79716b" />
          </div>
        }
        endMessage={
          <div className="text-center p-4 mt-4 text-gray-500 border rounded-md bg-gray-50">
            <p>End of feed</p>
          </div>
        }
      >
        {feed.map((feedItem) => (
          <div key={feedItem.id}>
            {renderActivity(feedItem)}
            <hr />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default FeedList;
