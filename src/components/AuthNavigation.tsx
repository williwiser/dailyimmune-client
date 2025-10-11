import { Link, NavLink } from "react-router";
import Container from "../layouts/Container";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAward,
  faBars,
  faBible,
  faBookmark,
  faCalendar,
  faChevronDown,
  faChevronUp,
  faClose,
  faDotCircle,
  faEdit,
  faHeart,
  faHome,
  faMessage,
  faPray,
  faShoppingBag,
  faUser,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Heart,
  HelpCircleIcon,
  MessageCircle,
  Plus,
  ReceiptText,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/useAuth";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import BadgeDialog from "./BadgeDialog";
import { useSocket } from "@/context/useSocket";
import { toast, Toaster } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  userId: string;
  createdAt: Date;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
interface BlockData {
  reason: string;
  comment: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
}

interface ReceiveMessageProps {
  sender: User;
  message: string;
  roomId: string;
  senderId: string;
  recipientId: string;
}

const AuthNavigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBadgeDialog, setShowBadgeDialog] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [newBadge, setNewBadge] = useState<Notification | null>(null);
  //const [showSidebar, setShowSidebar] = useState(false);
  const [blockData, setBlockData] = useState<BlockData>({
    reason: "",
    comment: "",
  });
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { socket } = useSocket();

  const handleSignOut = async () => {
    axios
      .post(`${BACKEND_URL}/api/v1/auth/logout`, {}, { withCredentials: true })
      .then((response) => {
        console.log(response);
        setUser(null);
        navigate("/");
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/notifications/unread-count`, {
        withCredentials: true,
      })
      .then((response) => {
        setUnreadCount(response.data.unreadCount);
      });

    axios
      .get(`${BACKEND_URL}/api/v1/users/block-status`, {
        withCredentials: true,
      })
      .then((response) => {
        setBlockData(response.data);
        setIsBlocked(response.data.blocked);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/notifications?limit=4`, {
        withCredentials: true,
      })
      .then((response) => {
        setNotifications(response.data);
      });
  }, []);

  useEffect(() => {
    notifications.forEach((notif) => {
      if (notif.type === "badge" && notif.isRead === false) {
        setShowBadgeDialog(true);
        setNewBadge(notif);
      }
    });
  }, [notifications]);

  const handleNotificationCount = async () => {
    setUnreadCount(0);
    axios
      .patch(
        `${BACKEND_URL}/api/v1/notifications/mark-all-read`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const handleReceiveMessage = ({
      sender,
      message,
      roomId,
      senderId,
      recipientId,
    }: ReceiveMessageProps) => {
      console.log("📩 Message received from:", sender);
      console.log("💬 Message:", message);
      console.log(
        "roomId:",
        roomId,
        "senderId:",
        senderId,
        "recipientId:",
        recipientId
      );
      toast(
        <div className="flex gap-2 items-center">
          <Avatar className="cursor-pointer">
            <AvatarImage src={sender.profilePhoto} className="object-cover" />
            <AvatarFallback>{sender.firstName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">
              {sender.firstName} {sender.lastName}
            </p>
            <p>{message}</p>
          </div>
        </div>
      );
      // If you have state for messages, you can update it here
      // setMessages(prev => [...prev, { sender, message }]);
    };
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  });

  return (
    <>
      <Toaster />
      <BadgeDialog
        open={showBadgeDialog}
        onOpenChange={setShowBadgeDialog}
        badgeNotification={newBadge}
      />
      <AlertDialog open={isBlocked} onOpenChange={setIsBlocked}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your account has been blocked</AlertDialogTitle>
            <AlertDialogDescription>
              Our administrator(s) have blocked your account for the following
              violation:{" "}
              <span className="font-semibold">{blockData.reason}</span>{" "}
              <br></br>
              <br></br>
              <span className="italic">
                {blockData.comment && `Comment: ${blockData.comment}`}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSignOut}>
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <nav
        className={`fixed w-full z-20 text-lg text-[#747474] border-b transition-all duration-300 bg-white ${
          isScrolled ? "shadow-sm " : "shadow-none"
        }`}
      >
        <Container className="px-6 md:px-8">
          <div className="flex justify-between items-center">
            <div className="md:flex grid grid-cols-3 items-center w-full">
              <div className="flex pl-2">
                <button
                  className="md:hidden"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <FontAwesomeIcon icon={showMenu ? faClose : faBars} />
                </button>
              </div>
              <div className="flex items-center justify-center md:justify-start w-full">
                <img src="/logo_trimmed.webp" className="h-14 " alt="logo" />
              </div>

              <ul className="hidden md:flex justify-center gap-8 text-sm">
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex flex-col gap-0.5 items-center hover:text-green-700 transition-all duration-200 ${
                        isActive ? "text-green-500" : ""
                      }`
                    }
                    end
                  >
                    <FontAwesomeIcon icon={faHome} />
                    <span>Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/testimonies"
                    className={({ isActive }) =>
                      `flex flex-col gap-0.5 items-center hover:text-green-700 transition-all duration-200 ${
                        isActive ? "text-green-500" : ""
                      }`
                    }
                    end
                  >
                    <FontAwesomeIcon icon={faHeart} />
                    <span>Testimonies</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/prayers"
                    className={({ isActive }) =>
                      `flex flex-col gap-0.5 items-center hover:text-green-700 transition-all duration-200 ${
                        isActive ? "text-green-500" : ""
                      }`
                    }
                    end
                  >
                    <FontAwesomeIcon icon={faPray} />
                    <span>Prayers</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/devotionals"
                    className={({ isActive }) =>
                      `flex flex-col gap-0.5 items-center hover:text-green-700 transition-all duration-200 ${
                        isActive ? "text-green-500" : ""
                      }`
                    }
                    end
                  >
                    <FontAwesomeIcon icon={faBible} />
                    <span>Devotionals</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/shop"
                    className={({ isActive }) =>
                      `flex flex-col gap-0.5 items-center hover:text-green-700 transition-all duration-200 ${
                        isActive ? "text-green-500" : ""
                      }`
                    }
                  >
                    <FontAwesomeIcon icon={faShoppingBag} />
                    <span>Shop</span>
                  </NavLink>
                </li>
              </ul>

              <div className="flex justify-end">
                <div className="hidden md:block border-r-2 h-[2.3rem] mx-6"></div>
                <div className="hidden md:flex items-center justify-end space-x-4 mr-3">
                  {user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger>
                        <FontAwesomeIcon
                          icon={faUserGear}
                          className="cursor-pointer hover:text-gray-700 duration-200 transition-all"
                          title="Admin Actions"
                        />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent className="p-2">
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/devotionals/new">
                            <div className="flex gap-2">
                              <Plus />
                              <span>New Devotional</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/events/me">
                            <div className="flex gap-2">
                              <Calendar />
                              <span>Manage Events</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <HelpCircleIcon className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
                  )}
                </div>
                <div className="flex justify-end gap-4 w-full">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger
                      className="flex items-center gap-1 cursor-pointer"
                      asChild
                    >
                      <button
                        className="relative"
                        onClick={handleNotificationCount}
                      >
                        <Bell className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white size-5 border-2 border-white flex items-center justify-center rounded-full">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-3 bg-white border-none p-4 h-max w-full">
                      <div className="flex flex-col h-full justify-between gap-5">
                        {notifications.length === 0 ? (
                          <div className="flex justify-center items-center text-sm text-gray-500 text-semibold">
                            No new notifications
                          </div>
                        ) : (
                          notifications.map((notification) => {
                            return (
                              <DropdownMenuItem asChild>
                                <Link to="/testimonies">
                                  {(() => {
                                    switch (notification.type) {
                                      case "like":
                                        return (
                                          <FontAwesomeIcon
                                            icon={faHeart}
                                            className="mr-4"
                                          />
                                        );

                                      case "badge":
                                        return (
                                          <FontAwesomeIcon
                                            icon={faAward}
                                            className="mr-4"
                                          />
                                        );
                                      case "message":
                                        return (
                                          <FontAwesomeIcon
                                            icon={faMessage}
                                            className="mr-4"
                                          />
                                        );
                                      case "comment":
                                        return (
                                          <FontAwesomeIcon
                                            icon={faMessage}
                                            className="mr-4"
                                          />
                                        );
                                      case "admin":
                                        return (
                                          <FontAwesomeIcon
                                            icon={faUser}
                                            className="mr-4"
                                          />
                                        );
                                      default:
                                        return (
                                          <FontAwesomeIcon
                                            icon={faDotCircle}
                                            className="mr-4"
                                          />
                                        );
                                    }
                                  })()}
                                  <div>
                                    <p className="font-semibold text-xs">
                                      {notification.title}
                                    </p>

                                    <p className="text-gray-500 text-xs max-w-[12rem]">
                                      {notification.message}
                                    </p>

                                    <span className="text-gray-500 text-xs max-w-[12rem] italic">
                                      {formatDistanceToNow(
                                        new Date(notification.createdAt),
                                        { addSuffix: true }
                                      )}
                                    </span>
                                  </div>
                                </Link>
                              </DropdownMenuItem>
                            );
                          })
                        )}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                      <Avatar className="cursor-pointer border">
                        <AvatarImage
                          src={user?.profilePhoto}
                          className="object-cover"
                        />
                        <AvatarFallback>{user?.firstName[0]}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="p-2">
                      <DropdownMenuItem asChild>
                        <Link to="profile/me">
                          <div className="flex gap-2">
                            <User />
                            <span>Profile</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="profile">
                          <div className="flex gap-2">
                            <ReceiptText />
                            <span>Orders</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link to="profile">
                          <div className="flex gap-2">
                            <MessageCircle />
                            <span>Messages</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <AlertDialog>
                          <AlertDialogTrigger className="text-sm w-full text-left pl-2 cursor-pointer hover:bg-stone-100 rounded-sm">
                            Sign Out
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Logging out will end your current session. Don't
                                worry though, we'll be here when you return!
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-[#3b3b19]"
                                onClick={handleSignOut}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* mobile menu */}

        <div
          className={`${
            showMenu ? "fixed" : "hidden"
          } md:hidden w-full bg-gray-800 text-white h-full`}
        >
          <ul className="text-lg font-semibold">
            <li>
              <Link
                className="flex justify-between items-center size-full p-4"
                onClick={() => {
                  setShowMenu(false);
                  setShowCommunityMenu(false);
                }}
                to="/dashboard"
              >
                <div className="flex gap-4 items-center">
                  <FontAwesomeIcon icon={faHome} />
                  <span>Home</span>
                </div>
              </Link>
            </li>
            <li>
              <button
                className="flex justify-between items-center size-full p-4"
                onClick={() => setShowCommunityMenu((prev) => !prev)}
              >
                <div className="flex gap-4 items-center">
                  <Users />
                  <span>Community</span>
                </div>
                <FontAwesomeIcon
                  icon={showCommunityMenu ? faChevronUp : faChevronDown}
                  className="text-gray-600"
                />
              </button>
            </li>

            {/* community menu*/}
            <ul
              className={`${
                showCommunityMenu ? "" : "hidden"
              } bg-gray-600 w-full`}
            >
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/testimonies"
                >
                  <div className="flex pl-10 gap-4 items-center">
                    <Heart />
                    <span>Testimonies</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/prayers"
                >
                  <div className="flex pl-10 gap-4 items-center">
                    <FontAwesomeIcon icon={faPray} />
                    <span>Prayer Requests</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/devotionals"
                >
                  <div className="flex pl-10 gap-4 items-center">
                    <FontAwesomeIcon icon={faBible} />
                    <span>Devotionals</span>
                  </div>
                </Link>
              </li>
            </ul>
            <li>
              <Link
                className="flex justify-between items-center size-full p-4"
                onClick={() => setShowMenu(false)}
                to="/shop"
              >
                <div className="flex gap-4 items-center">
                  <ShoppingBag />
                  <span>Shop</span>
                </div>
              </Link>
            </li>
            <hr className="border-gray-600 border-b-2"></hr>
            <li>
              <Link
                className="flex justify-between items-center size-full p-4"
                onClick={() => setShowMenu(false)}
                to="/dashboard/testimonies/me"
              >
                <div className="flex gap-4 items-center">
                  <FontAwesomeIcon icon={faHeart} />
                  <span>My Testimonies</span>
                </div>
              </Link>
            </li>
            {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/dashboard/devotionals/me"
                >
                  <div className="flex gap-4 items-center">
                    <FontAwesomeIcon icon={faBible} />
                    <span>My Devotionals</span>
                  </div>
                </Link>
              </li>
            )}
            <li>
              <Link
                className="flex justify-between items-center size-full p-4"
                onClick={() => setShowMenu(false)}
                to="/dashboard/prayer-requests/me"
              >
                <div className="flex gap-4 items-center">
                  <FontAwesomeIcon icon={faPray} />
                  <span>My Prayer Requests</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                className="flex justify-between items-center size-full p-4"
                onClick={() => setShowMenu(false)}
                to="/dashboard/events/me"
              >
                <div className="flex gap-4 items-center">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>Upcoming Events</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                className="flex justify-between items-center size-full p-4"
                onClick={() => setShowMenu(false)}
                to="/dashboard/testimonies/saved"
              >
                <div className="flex gap-4 items-center">
                  <FontAwesomeIcon icon={faBookmark} />
                  <span>Saved Items</span>
                </div>
              </Link>
            </li>
            <hr className="border-gray-600 border-b-2"></hr>
            <li>
              <Link
                className="flex justify-between items-center size-full p-4"
                onClick={() => setShowMenu(false)}
                to="/dashboard/prayer"
              >
                <div className="flex gap-4 items-center">
                  <FontAwesomeIcon icon={faEdit} />
                  <span>Submit a prayer request</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default AuthNavigation;
