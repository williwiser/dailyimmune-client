import { useAuth } from "@/context/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  faBookmark,
  faCalendar,
  faEdit,
  faHeart,
  faNewspaper,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  {
    title: "My Posts",
    icon: faNewspaper,
    link: "/posts/me",
  },
  {
    title: "My Prayer Requests",
    icon: faHeart,
    link: "/prayer-requests/me",
  },
  {
    title: "Upcoming Events",
    icon: faCalendar,
    link: "/events/me",
  },
  {
    title: "Saved Items",
    icon: faBookmark,
    link: "/saved/me",
  },
];

const Sidebar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="hidden md:flex flex-col gap-3 md:h-screen w-full md:w-xs">
      <div className="bg-white rounded-md overflow-hidden h-max pb-6 border">
        <div className="h-24 w-full bg-stone-300 bg-[url(/vines.webp)] bg-cover">
          <Avatar className="relative top-12 left-6 cursor-pointer size-20 mb-2 border-2 border-white  shadow-sm">
            <AvatarImage src={user?.profilePhoto} className="object-cover" />
            <AvatarFallback className="text-4xl">
              {user?.firstName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="pt-9 px-4">
          {loading ? (
            <Skeleton />
          ) : (
            <h1 className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </h1>
          )}

          {loading ? (
            <Skeleton />
          ) : (
            <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
          )}
          {(user?.role === "SUPERADMIN" || user?.role === "ADMIN") && (
            <span className="text-xs text-stone-700 bg-stone-200 rounded-md py-1 px-2 mb-4 z-30 bottom-0">
              {user?.role}
            </span>
          )}
          <Button
            onClick={() => navigate("/profile/me")}
            className="inline-flex gap-2 mt-4 w-full"
            variant="outline"
          >
            <FontAwesomeIcon icon={faUserEdit} /> <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md overflow-hidden h-max p-4 border">
        <ul className="flex flex-col gap-6">
          {navItems.map((navItem) => (
            <li>
              {loading ? (
                <Skeleton />
              ) : (
                <Link
                  to={navItem.link}
                  className="flex gap-2 items-center text-sm hover:text-gray-600 duration-200 transition-all"
                >
                  <FontAwesomeIcon icon={navItem.icon} />
                  <span className="text-sm">{navItem.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {loading ? (
        <Skeleton />
      ) : (
        <Link
          to="/dashboard/prayer"
          className="flex items-center bg-white rounded-md overflow-hidden h-max p-4 border text-sm gap-2 hover:text-gray-600 duration-200 transition-all"
        >
          <FontAwesomeIcon icon={faEdit} />
          <span>Submit a prayer request</span>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
