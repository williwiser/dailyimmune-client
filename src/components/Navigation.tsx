import { Link } from "react-router";
import Container from "../layouts/Container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
  faChevronRight,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const Navigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-20 text-lg text-[#747474] transition-all duration-300 ${
        isScrolled ? "shadow-sm bg-white" : "shadow-none"
      }`}
    >
      <Container>
        <div className="flex justify-between items-center md:grid md:grid-cols-3">
          <img src="logo_trimmed.webp" className="h-16" alt="logo" />
          <ul className="hidden md:flex justify-center gap-6">
            <li>
              <Link to="/">Home</Link>
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
                <DropdownMenuContent className="flex flex-col md:flex-row gap-4 bg-white border-none p-6 h-max w-full">
                  <Link
                    to="/signup"
                    className="flex bg-gradient-to-b from-gray-300 to-gray-600 flex-1 w-full max-w-[16rem] rounded-md p-4"
                  >
                    <div className="self-end text-white">
                      <p className="text-lg font-semibold">
                        Join Our Community
                      </p>
                      <p className="max-w-[13rem] text-balance">
                        Connect with fellow believers and grow in your faith
                        together.
                      </p>
                    </div>
                  </Link>
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
              <Link to="/encouragement">Encouragement</Link>
            </li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
          </ul>

          <ul className="hidden md:flex justify-end gap-4">
            <li>
              <Link to="/login" className="px-4 py-2 rounded-md border">
                Log In
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-md border border-[#3B3B1A] bg-[#3B3B1A] text-white"
              >
                Sign Up
              </Link>
            </li>
          </ul>

          <button className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
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
  );
};

export default Navigation;
