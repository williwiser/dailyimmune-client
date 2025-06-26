import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Clock, PenSquare } from "lucide-react";
import Container from "@/layouts/Container";
import { Link } from "react-router";
import SlideIn from "@/components/SlideIn";
import { useAuth } from "@/context/useAuth";
import axios from "axios";
import TestimonyCard from "@/components/TestimonyCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Testimony = {
  id: string;
  title: string;
  body: string;
  thumbnail: string;
  updatedAt: Date;
  // add other properties if needed
};

const Dashboard: React.FC = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };
  const { user } = useAuth();
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(" ") + "...";
  };
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/testimonies?authorId=${user?.id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setTestimonies(response.data);
        console.log(response.data);
      });
  }, [user?.id]);
  const recentActivity = [
    {
      type: "testimony",
      user: "Sarah M.",
      action: "shared a testimony about healing",
      time: "2 hours ago",
    },
    {
      type: "prayer",
      user: "John D.",
      action: "requested prayer for job interview",
      time: "4 hours ago",
    },
    {
      type: "encouragement",
      user: "Pastor Mike",
      action: "posted daily encouragement",
      time: "6 hours ago",
    },
    {
      type: "counselling",
      user: "Dr. Grace",
      action: "responded to counselling request",
      time: "8 hours ago",
    },
  ];

  return (
    <div className="min-h-screen g-[#eae7dd] bg-stone-100  md:p-6">
      <Container>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section with Verse of the Day */}
          <SlideIn direction="down">
            <div className="flex flex-col gap-2 text-[#747474] bg-[url(/vines.webp)] bg-white border bg-size-[13rem] bg-no-repeat bg-bottom-right md:bg-right rounded-md p-6">
              <h1 className="text-5xl  playfair-display-600">
                {getGreeting()}, {user?.firstName}
              </h1>
              <p>Let's build His Kingdom, one faithful act at a time</p>
              <div className="flex flex-col md:flex-row gap-2 mt-4">
                <Link
                  to="/dashboard/testimonies/new"
                  className="w-full md:w-fit"
                >
                  <div className="inline-flex gap-2 justify-center rounded-md text-white bg-[#3b3b19] px-6 py-2 w-full">
                    <PenSquare /> <span>Share your testimony</span>
                  </div>
                </Link>

                <Link to="prayer" className="w-full md:w-fit">
                  <div className="inline-flex gap-2 justify-center rounded-md bg-gray-200 px-6 py-2 w-full">
                    <Heart /> <span>Submit prayer request</span>
                  </div>
                </Link>

                <Link to="/" className="w-full md:w-fit">
                  <div className="inline-flex gap-2 justify-center rounded-md bg-gray-200 px-6 py-2 w-full">
                    <MessageCircle /> <span>Talk to us</span>
                  </div>
                </Link>
              </div>
            </div>
          </SlideIn>
          <div
            className={
              testimonies.length == 0
                ? "bg-white p-6 rounded-md border border-stone-300"
                : ""
            }
          >
            <h2 className="text-2xl font-bold text-[#3b3b19]">
              My Testimonies
            </h2>
            <ScrollArea className="w-full overflow-y-visible">
              <div className="grid grid-cols-4 mt-6 gap-6 w-max">
                {testimonies.length == 0 ? (
                  <p className=" text-[#747474]">
                    Your testimonies will appear here.
                  </p>
                ) : (
                  testimonies.map((testimony) => (
                    <TestimonyCard
                      key={testimony.id}
                      id={parseInt(testimony.id)}
                      thumbnail={testimony.thumbnail}
                      title={testimony.title}
                      body={truncateText(testimony.body, 15)}
                      edited={testimony.updatedAt}
                    />
                  ))
                )}
              </div>
              <br />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          {/* Recent Activity and Testimonies Side by Side */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Community Activity - Takes more space */}
            <div className="lg:col-span-2">
              <SlideIn direction="up" delay={0.3}>
                <div className=" bg-white rounded-md p-6 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <Clock className="w-6 h-6 mr-3 text-[#747474]" />
                    <h2 className="text-2xl font-bold text-[#3b3b19]">
                      Recent Community Activity
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start p-4 bg-[#eae7dd] rounded-md hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="w-2 h-2 bg-[#3b3b19] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-[#3b3b19]">
                              {activity.user}
                            </span>
                            <span className="text-sm text-[#747474]">
                              {activity.time}
                            </span>
                          </div>
                          <p className="text-[#747474]">{activity.action}</p>
                        </div>
                      </div>
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
              <div className="bg-white rounded-md p-6 border border-gray-200 h-full">
                <div className="flex items-center mb-6">
                  <Heart className="w-6 h-6 mr-3 text-[#747474]" />
                  <h2 className="text-xl font-bold text-[#3b3b19]">
                    Recent Testimonies
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
                  <button className="bg-[#3b3b19] text-white px-4 py-2 rounded-md hover:bg-[#4a4a22] transition-colors duration-200 text-sm">
                    Read All Testimonies
                  </button>
                </div>
              </div>
            </SlideIn>
          </div>

          {/* Personal Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-md p-6 border border-gray-200 text-center">
              <div className="text-3xl font-bold text-[#3b3b19] mb-2">3</div>
              <div className="text-[#747474]">Your Prayer Requests</div>
            </div>

            <div className="bg-white rounded-md p-6 border border-gray-200 text-center">
              <div className="text-3xl font-bold text-[#3b3b19] mb-2">127</div>
              <div className="text-[#747474]">Prayers Received</div>
            </div>

            <div className="bg-white rounded-md p-6 border border-gray-200 text-center">
              <div className="text-3xl font-bold text-[#3b3b19] mb-2">45</div>
              <div className="text-[#747474]">Days Active</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
