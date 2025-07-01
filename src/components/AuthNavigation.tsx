import { Link } from "react-router";
import Container from "../layouts/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
  faChevronUp,
  faClose,
  faPray,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {
  Bell,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  ReceiptText,
  Settings,
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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthNavigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

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

  return (
    <>
      <nav
        className={`fixed w-full z-20 text-lg text-[#747474] border-b transition-all duration-300 bg-white ${
          isScrolled ? "shadow-sm " : "shadow-none"
        }`}
      >
        <Container>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src="logo_trimmed.webp" className="h-16" alt="logo" />
              <div className="hidden md:block border-r-2 h-[2.3rem] mx-6"></div>
              <ul>
                <ul className="hidden md:flex justify-center gap-6">
                  <li>
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer">
                        <span>Community</span>
                        {"   "}
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="text-[0.5em]"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="flex flex-col gap-4 bg-white border-none p-2 h-max w-full">
                        <div className="flex flex-col h-full justify-between gap-5">
                          <DropdownMenuItem asChild>
                            <Link to="/testimonies">
                              <div>
                                <p className="font-semibold">Testimonies</p>
                                <p className="text-gray-500 max-w-[10rem]">
                                  Share and read inspiring faith-based stories
                                </p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/prayers">
                              <div>
                                <p className="font-semibold">Prayer Requests</p>
                                <p className="text-gray-500 max-w-[10rem]">
                                  Submit and pray for community needs
                                </p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/forum">
                              <div>
                                <p className="font-semibold">Forum</p>
                                <p className="text-gray-500 max-w-[10rem]">
                                  Engage in faith based discussions
                                </p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                  <li>
                    <Link to="/shop">Shop</Link>
                  </li>
                </ul>
              </ul>
            </div>
            <div className="hidden md:flex items-center justify-end space-x-4">
              <Bell className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
              <Settings className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profilePhoto} />
                    <AvatarFallback>{user?.firstName[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="p-2">
                  <DropdownMenuItem asChild>
                    <Link to="profile">
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
            <button
              className="md:hidden"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FontAwesomeIcon icon={showMenu ? faClose : faBars} />
            </button>
          </div>
        </Container>

        {/* mobile menu */}

        <div
          className={`${
            showMenu ? "fixed" : "hidden"
          } md:hidden w-full bg-gray-500 text-white h-full`}
        >
          <ul className="text-lg font-semibold">
            <li>
              <Link
                className="flex justify-between items-center size-full p-4"
                onClick={() => {
                  setShowMenu(false);
                  setShowCommunityMenu(false);
                  setShowProfileMenu(false);
                }}
                to="/dashboard"
              >
                <div className="flex gap-4 items-center">
                  <LayoutDashboard />
                  <span>Dashboard</span>
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
                  to="/dashboard"
                >
                  <div className="flex pl-10 gap-4 items-center">
                    <MessageCircle />
                    <span>Forum</span>
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
                to="/signup"
              >
                <div className="flex gap-4 items-center">
                  <MessageCircle />
                  <span>Messages</span>
                </div>
              </Link>
            </li>
            <li>
              <Link
                className="flex justify-between items-center size-full p-4"
                onClick={() => setShowMenu(false)}
                to="/signup"
              >
                <div className="flex gap-4 items-center">
                  <Bell />
                  <span>Notifications</span>
                </div>
              </Link>
            </li>
            <li>
              <button
                className="flex justify-between items-center size-full p-4"
                onClick={() => setShowProfileMenu((prev) => !prev)}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={user?.profilePhoto}
                    className="size-7 rounded-full"
                  />{" "}
                  <span>{user?.firstName}</span>
                </div>
                <FontAwesomeIcon
                  icon={showProfileMenu ? faChevronUp : faChevronDown}
                  className="text-gray-600"
                />
              </button>
            </li>
            {/* account menu*/}
            <ul
              className={`${
                showProfileMenu ? "" : "hidden"
              } bg-gray-600 w-full`}
            >
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/dashboard/profile"
                >
                  <div className="flex pl-10 gap-4 items-center">
                    <User />
                    <span>Profile</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/orders"
                >
                  <div className="flex pl-10 gap-4 items-center">
                    <FontAwesomeIcon icon={faReceipt} />
                    <span>Orders</span>
                  </div>
                </Link>
              </li>
              <li>
                <button
                  className="flex justify-between items-center size-full p-4"
                  onClick={handleSignOut}
                >
                  <div className="flex pl-10 gap-4 items-center">
                    <LogOut />
                    <span>Log out</span>
                  </div>
                </button>
              </li>
            </ul>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default AuthNavigation;
