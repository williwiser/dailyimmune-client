import React, { useEffect, useState } from "react";
import { Heart, PenSquare } from "lucide-react";
import { Link, Navigate } from "react-router";
import SlideIn from "@/components/SlideIn";
import { useAuth } from "@/context/useAuth";
import axios from "axios";
import Loader from "@/components/Loader";
import { Toaster } from "sonner";
import FeedList from "@/components/FeedList";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { slugify } from "@/utils/slugify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileVideo, faFileWaveform } from "@fortawesome/free-solid-svg-icons";
import VideoUploadModal from "@/components/VideoUploadModal";
import AudioUploadModal from "@/components/AudioUploadModal";
import { SPECIAL_ROLES } from "@/permissions/roles";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

interface Testimony {
  id: string;
  title: string;
  body: string;
  thumbnail: string;
  updatedAt: Date;
  user: User;
  status: string;
  likes: number;
  // add other properties if needed
}
const Feed: React.FC = () => {
  const [staffPicks, setStaffPicks] = useState<Testimony[]>([]);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [openAudioModal, setOpenAudioModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  type FeedActivity = {
    id: string;
    type: string;
    authorName: string;
    authorPhoto?: string;
    authorId: string;
    createdAt: string;
    content: string;
    thumbnail?: string;
    extra?: {
      body?: string;
      isAnswered?: boolean;
    };
  };

  const [, setFeed] = useState<FeedActivity[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/feed?page=1&limit=7`)
      .then((response) => {
        setFeed(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/posts/staff-picks?page=1&limit=3`)
      .then((response) => {
        setStaffPicks(response.data);
      });
  }, []);

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(" ") + "...";
  };

  return isLoading ? (
    <Loader />
  ) : user ? (
    <div className="min-h-screen g-[#eae7dd]">
      <Toaster />
      <VideoUploadModal
        open={openVideoModal}
        onOpenChange={setOpenVideoModal}
      />
      <AudioUploadModal
        open={openAudioModal}
        onOpenChange={setOpenAudioModal}
      />
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Recent Activity and Testimonies Side by Side */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Community Activity - Takes more space */}
          <div className="lg:col-span-2">
            {/* Welcome Section with Verse of the Day */}
            <SlideIn direction="down">
              <div className="flex flex-col gap-2 text-[#747474] md:bg-none bg-white border bg-size-[13rem] bg-no-repeat bg-bottom-right md:bg-right md:rounded-md p-6">
                <div className="flex flex-col gap-2 w-full">
                  <Link
                    to="/posts/new"
                    className="w-full border rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="inline-flex gap-2 text-gray-500 px-6 py-2 w-full">
                      <PenSquare />{" "}
                      <span>
                        What's on your heart
                        <span className="hidden md:inline">
                          , {user?.firstName}
                        </span>
                        ?
                      </span>
                    </div>
                  </Link>
                  {SPECIAL_ROLES.includes(user.role) && (
                    <div className="px-4 flex gap-8 mt-4">
                      <button
                        className="cursor-pointer w-fit text-sm"
                        onClick={() => setOpenVideoModal(true)}
                      >
                        <FontAwesomeIcon
                          icon={faFileVideo}
                          className="text-stone-500"
                        />{" "}
                        Upload Video
                      </button>
                      <button
                        className="cursor-pointer w-fit text-sm"
                        onClick={() => setOpenAudioModal(true)}
                      >
                        <FontAwesomeIcon
                          icon={faFileWaveform}
                          className="text-stone-500"
                        />{" "}
                        Upload Audio
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </SlideIn>
            <hr className="w-full my-4 border-gray-300"></hr>

            <FeedList />
          </div>

          {/* Recent Testimonies - Compact version */}
          <SlideIn direction="up" delay={0.5} className="h-full">
            <div className="bg-white md:rounded-md p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <Heart className="w-6 h-6 mr-3 text-[#747474]" />
                <h2 className="text-xl font-bold text-[#3b3b19]">
                  Staff Picks
                </h2>
              </div>

              <div className="space-y-4">
                {staffPicks.length === 0 ? (
                  <p className="text-center p-4 mt-4 bg-gray-50 text-gray-500 rounded-md border">
                    No staff picks
                  </p>
                ) : (
                  staffPicks.map((staffPick) => (
                    <div className="border-l-4 border-[#3b3b19] pl-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#3b3b19] text-sm">
                          {staffPick.user.firstName}{" "}
                          {staffPick.user.lastName[0]}.
                        </span>
                        <span className="text-xs text-[#747474]">
                          {formatDistanceToNow(new Date(staffPick.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <Link
                        to={`/testimonies/${staffPick.id}/${slugify(
                          staffPick.title
                        )}`}
                        className="text-sm font-medium text-[#3b3b19] mb-1 hover:text-[#61612e] hover:underline transition-all duration-200"
                      >
                        {staffPick.title}
                      </Link>
                      <p className="text-[#747474] text-xs leading-relaxed line-clamp-2">
                        {truncateText(staffPick.body, 20)}
                      </p>
                      <div className="mt-2 flex items-center text-xs text-[#747474]">
                        <Heart className="w-3 h-3 mr-1" />
                        <span>{staffPick.likes}</span>
                      </div>
                    </div>
                  ))
                )}{" "}
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/testimonies"
                  className="bg-[#3b3b19] text-white px-4 py-2 rounded-md hover:bg-[#4a4a22] transition-colors duration-200 text-sm"
                >
                  Read All Testimonies
                </Link>
              </div>
            </div>
          </SlideIn>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Feed;
