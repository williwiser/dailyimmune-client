import { Link } from "react-router";
import Container from "../layouts/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronRight,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Bell, Settings } from "lucide-react";
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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthNavigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleSignOut = async () => {
    axios
      .post(`${BACKEND_URL}/api/v1/auth/logout`, { withCredentials: true })
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
              <div className="border-r-2 h-[2.3rem] mx-6"></div>
              <ul>
                <ul className="hidden md:flex justify-center gap-6">
                  <li>
                    <Link to="/">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/encouragement">Community</Link>
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
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName[0]}
                    </span>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Orders</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <AlertDialog>
                      <AlertDialogTrigger className="text-sm pl-2 cursor-pointer">
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
        <div
          className={`${
            showMenu ? "fixed" : "hidden"
          } md:hidden w-full bg-slate-800 text-white h-full`}
        >
          <Container>
            <ul className="text-lg font-semibold">
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/"
                >
                  <span>Home</span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-slate-500"
                  />
                </Link>
              </li>
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/"
                >
                  <span>Community</span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-slate-500"
                  />
                </Link>
              </li>
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/encouragement"
                >
                  <span>Encouragement</span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-slate-500"
                  />
                </Link>
              </li>
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/shop"
                >
                  <span>Shop</span>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-slate-500"
                  />
                </Link>
              </li>
              <hr className="border-slate-700 border-b-2"></hr>
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/login"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  className="flex justify-between items-center size-full p-4"
                  onClick={() => setShowMenu(false)}
                  to="/signup"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </Container>
        </div>
      </nav>
    </>
  );
};

export default AuthNavigation;
