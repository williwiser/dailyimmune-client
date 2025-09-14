import { useAuth } from "@/context/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import {
  faBible,
  faBookmark,
  faCalendar,
  faEdit,
  faHeart,
  faPray,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const { user } = useAuth();
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
          <h1 className="text-lg font-semibold">
            {user?.firstName} {user?.lastName}
          </h1>

          <p className="text-sm text-gray-500 mb-2">{user?.email}</p>
          {(user?.role === "SUPERADMIN" || user?.role === "ADMIN") && (
            <span className="text-xs text-stone-700 bg-stone-200 rounded-md py-1 px-2 mb-4 z-30 bottom-0">
              {user?.role}
            </span>
          )}
          <Button
            onClick={() => navigate("/dashboard/profile/me")}
            className="inline-flex gap-2 mt-4 w-full"
            variant="outline"
          >
            <FontAwesomeIcon icon={faUserEdit} /> <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md overflow-hidden h-max p-4 border">
        <ul className="flex flex-col gap-6">
          <li>
            <Link
              to="/dashboard/testimonies/me"
              className="flex gap-2 items-center text-sm"
            >
              <FontAwesomeIcon icon={faHeart} />
              <span className="text-sm">My Testimonies</span>
            </Link>
          </li>
          {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
            <li>
              <Link
                to="/dashboard/devotionals/me"
                className="flex gap-2 items-center text-sm"
              >
                <FontAwesomeIcon icon={faBible} />
                <span className="text-sm">My Devotionals</span>
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/dashboard/prayer-requests/me"
              className="flex gap-2 items-center text-sm"
            >
              <FontAwesomeIcon icon={faPray} />
              <span className="text-sm">My Prayer Requests</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/events/me"
              className="flex gap-2 items-center text-sm"
            >
              <FontAwesomeIcon icon={faCalendar} />
              <span className="text-sm">Upcoming Events</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/testimonies/saved"
              className="flex gap-2 items-center text-sm"
            >
              <FontAwesomeIcon icon={faBookmark} />
              <span>Saved Items</span>
            </Link>
          </li>
        </ul>
      </div>

      <Link
        to="/dashboard/prayer"
        className="flex items-center bg-white rounded-md overflow-hidden h-max p-4 border text-sm gap-2"
      >
        <FontAwesomeIcon icon={faEdit} />
        <span>Submit a prayer request</span>
      </Link>
    </div>
  );
};

export default Sidebar;
