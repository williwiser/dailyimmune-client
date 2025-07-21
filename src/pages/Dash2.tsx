import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Clock,
  PenSquare,
  Bookmark,
  Share2,
} from "lucide-react";
import { Link } from "react-router";
import SlideIn from "@/components/SlideIn";
import { useAuth } from "@/context/useAuth";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import Loader from "@/components/Loader";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
interface PrayerRequest {
  id: string;
  subject: string;
  body: string;
  updatedAt: Date;
  requester: User;
  isAnswered: boolean;
  isPublic: boolean;
  // add other properties if needed
}

const Dashboard: React.FC = () => {
  const [, setTestimonies] = useState<Testimony[]>([]);
  const [, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  type FeedActivity = {
    id: string;
    type: string;
    authorName: string;
    authorPhoto?: string;
    createdAt: string;
    content: string;
    thumbnail?: string;
    extra?: {
      body?: string;
      [key: string]: unknown;
    };
  };

  const [feed, setFeed] = useState<FeedActivity[]>([]);

  const [, setDrafts] = useState<Testimony[]>([]);

  const { user } = useAuth();
  // const truncateText = (text: string, wordLimit: number) => {
  //   const words = text.split(" ");
  //   if (words.length <= wordLimit) return text;

  //   return words.slice(0, wordLimit).join(" ") + "...";
  // };
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/testimonies/drafts?page=1&limit=4`, {
        withCredentials: true,
      })
      .then((response) => {
        setDrafts(response.data);
        console.log("drafts: " + response.data);
      });

    axios.get(`${BACKEND_URL}/api/v1/feed?page=1&limit=7`).then((response) => {
      setFeed(response.data);
    });

    axios
      .get(
        `${BACKEND_URL}/api/v1/testimonies?authorId=${user?.id}&page=1&limit=4`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setTestimonies(response.data);
        console.log(response.data);
      });

    axios
      .get(`${BACKEND_URL}/api/v1/prayers/me?&page=1&limit=4`, {
        withCredentials: true,
      })
      .then((response) => {
        setPrayerRequests(response.data);
        console.log(response.data);
      });

    setIsLoading(false);
  }, [user?.id]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="min-h-screen g-[#eae7dd]">
      <div className="max-w-7xl mx-auto space-y-2">
        {/*
            {testimonies.length === 0 && drafts.length === 0 ? (
              <div className="bg-white p-6 rounded-md border border-stone-300">
                <h2 className="text-2xl font-bold text-[#3b3b19]">
                  My Testimonies
                </h2>
                <p className=" text-[#747474] mt-6">
                  Your testimonies will appear here.
                </p>
              </div>
            ) : null}
            
            {drafts.length === 0 ? null : (
              <div>
                <h2 className="text-2xl font-bold text-[#3b3b19]">My Drafts</h2>
                <ScrollArea className="block md:hidden w-full overflow-y-visible">
                  <div className="flex mt-6 gap-6 w-max">
                    {drafts.map((draft) => (
                      <TestimonyCard
                        key={draft.id}
                        id={parseInt(draft.id)}
                        thumbnail={draft.thumbnail}
                        title={draft.title}
                        body={truncateText(draft.body, 15)}
                        edited={draft.updatedAt}
                        author={`${draft.user.firstName} ${draft.user.lastName}`}
                        status={draft.status}
                        edit={draft.user.id == user?.id}
                      />
                    ))}
                  </div>
                  <br />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 mt-6 gap-6 w-full">
                  {drafts.map((testimony) => (
                    <TestimonyCard
                      key={testimony.id}
                      id={parseInt(testimony.id)}
                      thumbnail={testimony.thumbnail}
                      title={testimony.title}
                      body={truncateText(testimony.body, 15)}
                      edited={testimony.updatedAt}
                      author={`${testimony.user.firstName} ${testimony.user.lastName}`}
                      status={testimony.status}
                      edit={testimony.user.id == user?.id}
                    />
                  ))}
                </div>
              </div>
            )}
           
            {testimonies.length === 0 ? null : (
              <div>
                <h2 className="text-2xl font-bold text-[#3b3b19]">
                  My Testimonies
                </h2>
                <ScrollArea className="block md:hidden w-full overflow-y-visible">
                  <div className="flex mt-6 gap-6 w-max">
                    {testimonies.map((testimony) => (
                      <TestimonyCard
                        key={testimony.id}
                        id={parseInt(testimony.id)}
                        thumbnail={testimony.thumbnail}
                        title={testimony.title}
                        body={truncateText(testimony.body, 15)}
                        edited={testimony.updatedAt}
                        author={`${testimony.user.firstName} ${testimony.user.lastName}`}
                        status={testimony.status}
                        edit={testimony.user.id == user?.id}
                      />
                    ))}
                  </div>
                  <br />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 mt-6 gap-6 w-full">
                  {testimonies.map((testimony) => (
                    <TestimonyCard
                      key={testimony.id}
                      id={parseInt(testimony.id)}
                      thumbnail={testimony.thumbnail}
                      title={testimony.title}
                      body={truncateText(testimony.body, 15)}
                      edited={testimony.updatedAt}
                      author={`${testimony.user.firstName} ${testimony.user.lastName}`}
                      status={testimony.status}
                      edit={testimony.user.id == user?.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {prayerRequests.length === 0 ? null : (
              <div>
                <h2 className="text-2xl font-bold text-[#3b3b19]">
                  My Prayer Requests
                </h2>
                <ScrollArea className="block md:hidden w-full overflow-y-visible">
                  <div className="flex mt-6 gap-6 w-max">
                    {prayerRequests.map((prayerRequest) => (
                      <PrayerRequestCard
                        key={prayerRequest.id}
                        id={parseInt(prayerRequest.id)}
                        subject={prayerRequest.subject}
                        body={truncateText(prayerRequest.body, 15)}
                        isAnswered={prayerRequest.isAnswered}
                        author={`${prayerRequest.requester.firstName} ${prayerRequest.requester.lastName}`}
                        edited={prayerRequest.updatedAt}
                        isPublic={prayerRequest.isPublic}
                        edit
                      />
                    ))}
                  </div>
                  <br />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 mt-6 gap-6 w-full">
                  {prayerRequests.map((prayerRequest) => (
                    <PrayerRequestCard
                      key={prayerRequest.id}
                      id={parseInt(prayerRequest.id)}
                      subject={prayerRequest.subject}
                      body={truncateText(prayerRequest.body, 15)}
                      isAnswered={prayerRequest.isAnswered}
                      author={`${prayerRequest.requester.firstName} ${prayerRequest.requester.lastName}`}
                      edited={prayerRequest.updatedAt}
                      isPublic={prayerRequest.isPublic}
                      edit
                    />
                  ))}
                </div>
              </div>
            )} */}

        {/* Recent Activity and Testimonies Side by Side */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Community Activity - Takes more space */}
          <div className="lg:col-span-2">
            {/* Welcome Section with Verse of the Day */}
            <SlideIn direction="down" className="mb-2">
              <div className="flex flex-col gap-2 text-[#747474] md:bg-none bg-white border bg-size-[13rem] bg-no-repeat bg-bottom-right md:bg-right rounded-md p-6">
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <Avatar className="size-10 hidden">
                    <AvatarImage src={user?.profilePhoto} />
                    <AvatarFallback>{user?.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <Link
                    to="/dashboard/testimonies/new"
                    className="w-full border rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                  >
                    <div className="inline-flex gap-2 text-gray-500 px-6 py-2 w-full">
                      <PenSquare /> <span>Share your testimony</span>
                    </div>
                  </Link>
                </div>
              </div>
            </SlideIn>
            <hr className="w-full my-4 border-gray-300"></hr>
            <SlideIn direction="up" delay={0.3}>
              <div className=" bg-white rounded-md p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                  <Clock className="w-6 h-6 mr-3 text-[#747474]" />
                  <h2 className="text-2xl font-bold text-[#3b3b19]">
                    Recent Community Activity
                  </h2>
                </div>

                <div className="space-y-4">
                  {feed.map((activity) => (
                    <Link
                      to={
                        activity.type === "testimony"
                          ? `/testimonies/${activity.id.split("-")[1]}`
                          : activity.type === "prayerRequest"
                          ? "/prayers"
                          : "/"
                      }
                      className="flex flex-col p-4 border-b g-[#eae7dd] rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex gap-2 mb-2">
                        <Avatar className="cursor-pointer size-10">
                          <AvatarImage src={activity.authorPhoto} />
                          <AvatarFallback>
                            {activity.authorName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-[#3b3b19] text-sm">
                            {activity.authorName}
                          </p>
                          <span className="text-sm text-[#747474]">
                            {formatDistanceToNow(new Date(activity.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="w-full">
                          <div className="flex flex-col justify-between mb-1">
                            <h1 className="font-bold text-lg">
                              {activity.content}
                            </h1>
                            {activity.type === "testimony" ? (
                              <p className="mb-4 text-sm text-gray-500 text-pretty">
                                {activity.extra?.body}
                              </p>
                            ) : null}
                          </div>
                          <div className="flex gap-4 mt-auto">
                            <button className="cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-200">
                              <Heart size={16} />
                            </button>
                            <button className="cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-200">
                              <Bookmark size={16} />
                            </button>
                            <button className="cursor-pointer text-gray-400 hover:text-gray-600 transition-all duration-200">
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                        {activity.thumbnail ? (
                          <img
                            src={activity.thumbnail}
                            className="w-full h-full sm:w-28 sm:h-28 object-cover rounded-md"
                          />
                        ) : (
                          <img
                            src="/placeholder.jpg"
                            className="w-full h-full sm:w-28 sm:h-28 object-cover rounded-md"
                          />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button className="bg-[#3b3b19] text-white px-6 py-2 rounded-md hover:bg-[#4a4a22] transition-colors duration-200">
                    View All Activity
                  </button>
                </div>
              </div>
            </SlideIn>
          </div>

          {/* Recent Testimonies - Compact version */}
          <SlideIn direction="up" delay={0.5} className="h-full">
            <div className="bg-white rounded-md p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <Heart className="w-6 h-6 mr-3 text-[#747474]" />
                <h2 className="text-xl font-bold text-[#3b3b19]">
                  Staff Picks
                </h2>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-[#3b3b19] pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#3b3b19] text-sm">
                      Maria L.
                    </span>
                    <span className="text-xs text-[#747474]">1 day ago</span>
                  </div>
                  <h3 className="text-sm font-medium text-[#3b3b19] mb-1">
                    God's Provision in Financial Crisis
                  </h3>
                  <p className="text-[#747474] text-xs leading-relaxed line-clamp-2">
                    "I lost my job three months ago and was struggling to pay
                    rent. After much prayer, I received an unexpected call..."
                  </p>
                  <div className="mt-2 flex items-center text-xs text-[#747474]">
                    <Heart className="w-3 h-3 mr-1" />
                    <span>24</span>
                    <MessageCircle className="w-3 h-3 ml-3 mr-1" />
                    <span>8</span>
                  </div>
                </div>

                <div className="border-l-4 border-[#3b3b19] pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#3b3b19] text-sm">
                      David K.
                    </span>
                    <span className="text-xs text-[#747474]">2 days ago</span>
                  </div>
                  <h3 className="text-sm font-medium text-[#3b3b19] mb-1">
                    Healing from Depression
                  </h3>
                  <p className="text-[#747474] text-xs leading-relaxed line-clamp-2">
                    "After months of darkness, I found hope through this
                    community's prayers and God's love..."
                  </p>
                  <div className="mt-2 flex items-center text-xs text-[#747474]">
                    <Heart className="w-3 h-3 mr-1" />
                    <span>31</span>
                    <MessageCircle className="w-3 h-3 ml-3 mr-1" />
                    <span>12</span>
                  </div>
                </div>

                <div className="border-l-4 border-[#3b3b19] pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#3b3b19] text-sm">
                      Grace M.
                    </span>
                    <span className="text-xs text-[#747474]">3 days ago</span>
                  </div>
                  <h3 className="text-sm font-medium text-[#3b3b19] mb-1">
                    Restored Marriage
                  </h3>
                  <p className="text-[#747474] text-xs leading-relaxed line-clamp-2">
                    "My husband and I were on the brink of divorce. Through
                    counseling here and persistent prayer..."
                  </p>
                  <div className="mt-2 flex items-center text-xs text-[#747474]">
                    <Heart className="w-3 h-3 mr-1" />
                    <span>18</span>
                    <MessageCircle className="w-3 h-3 ml-3 mr-1" />
                    <span>6</span>
                  </div>
                </div>
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
  );
};

export default Dashboard;
