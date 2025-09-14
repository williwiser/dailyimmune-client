import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Container from "@/layouts/Container";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  Heart,
  Calendar,
  Award,
  MessageCircle,
  Heart as Pray,
  Clock,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward } from "@fortawesome/free-solid-svg-icons";
import { slugify } from "@/utils/slugify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Badge {
  id: string;
  name: string;
  description: string;
  slug: string;
  category: string;
  rarity: "common" | "rare" | "legendary";
  createdAt: Date;
}

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

interface PrayerRequest {
  id: string;
  subject: string;
  body: string;
  updatedAt: Date;
  requester: User;
  isAnswered: boolean;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  profilePhoto: string;
  createdAt: Date;
  badges: Badge[];
  testimonies: Testimony[];
  prayerRequests: PrayerRequest[];
}

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    profilePhoto: "",
    createdAt: new Date(),
    badges: [],
    testimonies: [],
    prayerRequests: [],
  });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const { id } = useParams();
  const [joined, setJoined] = useState("");

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/users/profile/${id}`).then((response) => {
      console.log(response.data);
      setUser(response.data);
    });
  }, [id]);

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(" ") + "...";
  };

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/users/profile/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setIsLoading(false);
        setUser(response.data);
        setJoined(
          new Intl.DateTimeFormat("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(response.data.createdAt))
        );

        // TODO: Replace with actual API calls
        setBadges(user.badges);
        setTestimonies(user.testimonies);
        setPrayerRequests(user.prayerRequests);
      });
  }, [id, user]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Profile Header */}
      <section className="relative bg-stone-200 text-stone-800">
        <Container>
          <div className="py-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="size-40 border-4 border-white/20 shadow-2xl">
                  <AvatarImage
                    src={user?.profilePhoto}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-6xl bg-white/10 text-stone-800">
                    {user?.firstName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {`${user?.firstName} ${user?.lastName}`}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-stone-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {joined}</span>
                </div>
                {user?.bio && (
                  <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
          {/* Left Column - Badges & Stats */}
          <div className="space-y-6 ">
            {/* Badges Section */}
            <div className="border p-6 rounded-md bg-white/80">
              <div className="flex items-center gap-3 pb-3">
                <Award className="size-8 text-yellow-500" />
                <div className="flex flex-col">
                  <span className="font-semibold text-xl">Badges Earned</span>
                  <p className="text-gray-500 text-sm">
                    Achievements and milestones
                  </p>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
                    >
                      <div
                        className={`p-2 flex justify-center items-center size-12 rounded-full bg-amber-500 text-white`}
                      >
                        <FontAwesomeIcon icon={faAward} className="text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {badge.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border bg-white/80 p-6 rounded-md">
              <div className="pb-3">
                <h1 className="text-xl font-semibold">Community Impact</h1>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {badges.length}
                    </div>
                    <div className="text-sm text-gray-600">Badges</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {testimonies.length}
                    </div>
                    <div className="text-sm text-gray-600">Testimonies</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {prayerRequests.length}
                    </div>
                    <div className="text-sm text-gray-600">Prayer Requests</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-gray-600">
                      Prayers Received
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Testimonies & Prayer Requests */}
          <div className="lg:col-span-2 space-y-6">
            {/* Testimonies Section */}
            <div className="border bg-white/80 p-6 rounded-md">
              <div className="flex items-center gap-3 pb-6">
                <Heart className="size-8 text-yellow-500" />
                <div className="flex flex-col">
                  <span className="font-semibold text-xl">
                    Testimonies shared
                  </span>
                  <p className="text-gray-500 text-sm">
                    Stories of God's faithfulness
                  </p>
                </div>
              </div>
              <div>
                {testimonies.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No testimonies shared yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {testimonies.map((testimony, index) => (
                      <div key={testimony.id}>
                        <article className="group">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <img
                                src={
                                  testimony.thumbnail
                                    ? testimony.thumbnail
                                    : "/placeholder.jpg"
                                }
                                className="size-32 rounded-md object-cover"
                                alt="testimony thumbnail"
                              />
                            </div>
                            <div className="flex-1">
                              <Link
                                to={`/testimonies/${testimony.id}/${slugify(
                                  testimony.title
                                )}`}
                                className="text-xl font-semibold text-stone-800 mb-2 group-hover:text-stone-600 transition-colors"
                              >
                                {testimony.title}
                              </Link>
                              <p className="text-gray-700 leading-relaxed mb-3">
                                {truncateText(testimony.body, 30)}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(
                                    testimony.updatedAt
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4 text-red-400" />
                                  {testimony.likes}{" "}
                                  {testimony.likes === 1 ? "like" : "likes"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                        {index < testimonies.length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Prayer Requests Section */}
            <div className="border bg-white/80 p-6 rounded-md">
              <div className="flex items-center gap-3 pb-6">
                <Heart className="size-8 text-yellow-500" />
                <div className="flex flex-col">
                  <span className="font-semibold text-xl">Prayer Requests</span>
                  <p className="text-gray-500 text-sm">
                    Seeking prayer and support from the community
                  </p>
                </div>
              </div>
              <div>
                {prayerRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Pray className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No prayer requests at this time</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {prayerRequests.map((request, index) => (
                      <div key={request.id}>
                        <article className="group">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  request.isAnswered
                                    ? "bg-gradient-to-br from-green-400 to-emerald-500"
                                    : "bg-gradient-to-br from-blue-400 to-indigo-500"
                                }`}
                              >
                                <Pray className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                  {request.subject}
                                </h3>
                                <Badge
                                  variant={
                                    request.isAnswered ? "default" : "secondary"
                                  }
                                  className={
                                    request.isAnswered
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                  }
                                >
                                  {request.isAnswered ? "Answered" : "Active"}
                                </Badge>
                              </div>
                              <p className="text-gray-700 leading-relaxed mb-3">
                                {request.body}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {new Date(
                                    request.updatedAt
                                  ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Pray className="w-4 h-4 text-blue-400" />
                                  12 people praying
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                        {index < prayerRequests.length - 1 && (
                          <Separator className="mt-6" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
