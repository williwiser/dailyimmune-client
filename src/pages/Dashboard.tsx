import { useState, useEffect } from "react";
import {
  Heart,
  Edit3,
  MessageCircle,
  BookOpen,
  Users,
  Share2,
  Bookmark,
  Clock,
  Sunrise,
  Moon,
  Sun,
} from "lucide-react";
import Container from "@/layouts/Container";
import { useAuth } from "@/context/useAuth";

const ChristianDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12)
      return {
        text: "Good morning",
        icon: <Sunrise className="w-5 h-5 text-yellow-400" />,
      };
    if (hour < 17)
      return {
        text: "Good afternoon",
        icon: <Sun className="w-5 h-5 text-orange-400" />,
      };
    return {
      text: "Good evening",
      icon: <Moon className="w-5 h-5 text-blue-300" />,
    };
  };

  const greeting = getGreeting();

  const recentActivity = [
    {
      type: "shared",
      content: 'Shared testimony: "God\'s Grace in Hard Times"',
      time: "2 hours ago",
    },
    { type: "saved", content: "Saved verse: Romans 8:28", time: "5 hours ago" },
    { type: "message", content: "New message from Sarah", time: "1 day ago" },
  ];

  const trendingTestimonies = [
    {
      title: "Finding Hope After Loss",
      author: "Michael R.",
      prayers: 127,
      time: "3 days ago",
    },
    {
      title: "God's Provision in Unemployment",
      author: "Lisa M.",
      prayers: 89,
      time: "1 week ago",
    },
    {
      title: "Healing Through Faith",
      author: "David K.",
      prayers: 203,
      time: "2 days ago",
    },
  ];

  const latestTestimonies = [
    {
      title: "A Miracle in Disguise",
      author: "Emma S.",
      excerpt: "I never thought losing my job would lead to...",
      time: "2 hours ago",
    },
    {
      title: "Answered Prayers",
      author: "John D.",
      excerpt: "After months of praying for my son's health...",
      time: "4 hours ago",
    },
    {
      title: "Finding Peace in Chaos",
      author: "Maria L.",
      excerpt: "In the midst of family struggles, God showed...",
      time: "6 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Container>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-b from-stone-500 to-stone-500/50 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                {greeting.icon}
                <h2 className="text-2xl font-light">
                  {greeting.text}, {user?.firstName}
                </h2>
              </div>
              <p className="text-stone-100 mb-6 text-lg">
                May your day be filled with peace and purpose.
              </p>

              {/* Daily Verse */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-6 h-6 text-yellow-300 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-lg font-medium mb-2 leading-relaxed">
                      "I can do all things through Christ who strengthens me."
                    </p>
                    <p className="text-stone-200 text-sm">— Philippians 4:13</p>
                  </div>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-white text-blue-700 rounded-xl p-4 font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2 group">
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Share Your Testimony</span>
                </button>
                <button className="bg-white/20 backdrop-blur-sm text-white rounded-xl p-4 font-semibold hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20 group">
                  <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Start Writing Your Story</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Recent Activity & Prayer Updates */}
            <div className="lg:col-span-1 space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "shared"
                            ? "bg-green-500"
                            : activity.type === "saved"
                            ? "bg-blue-500"
                            : "bg-purple-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          {activity.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prayer Update */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Heart className="w-5 h-5 text-green-600 mr-2" />
                  Prayer Update
                </h3>
                <div className="bg-white rounded-xl p-4 border border-green-100">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Sarah responded to your prayer request:</strong>
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    "Praying for strength and wisdom for you during this time.
                    God has great plans! 🙏"
                  </p>
                  <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                </div>
              </div>

              {/* People Praying */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  People Are Praying for You!
                </h3>
                <div className="flex -space-x-2 mb-3">
                  {["M", "S", "D", "L", "A"].map((initial, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white"
                    >
                      {initial}
                    </div>
                  ))}
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white">
                    +12
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  17 people are lifting you up in prayer today
                </p>
              </div>
            </div>

            {/* Right Column - Testimonies */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trending Testimonies */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 text-orange-600 mr-2" />
                  Trending Testimonies
                </h3>
                <div className="space-y-4">
                  {trendingTestimonies.map((testimony, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                          {testimony.title}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {testimony.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          by {testimony.author}
                        </p>
                        <div className="flex items-center space-x-1 text-red-500">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{testimony.prayers}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Testimonies */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
                  Latest Testimonies
                </h3>
                <div className="space-y-4">
                  {latestTestimonies.map((testimony, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                          {testimony.title}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {testimony.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {testimony.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          by {testimony.author}
                        </p>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <Bookmark className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                            <Share2 className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ChristianDashboard;
