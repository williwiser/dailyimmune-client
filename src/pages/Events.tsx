import EventModal from "@/components/EventModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/useAuth";
import {
  faCalendar,
  faCalendarMinus,
  faCalendarPlus,
  faClock,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Bookmark } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { toast } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface User {
  id: string;
  profilePhoto: string;
  firstName: string;
  lastName: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  additionalNotes: string;
  date: Date;
  host: User;
}

export const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openEventModal, setOpenEventModal] = useState(false);
  const [savedItems, setSavedItems] = useState<{ [key: string]: boolean }>({});
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/events/`).then((response) => {
      setEvents(response.data);
    });

    axios
      .get(`${BACKEND_URL}/api/v1/events/me`, { withCredentials: true })
      .then((response) => {
        setMyEvents(response.data);
      });
  }, []);

  const toggleSaved = (id: string) => {
    setSavedItems((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle this specific item
    }));
    console.log(savedItems);
    if (savedItems[id]) {
      toast("Event unsaved", {
        icon: <FontAwesomeIcon icon={faCalendarMinus} />,
      });
    } else {
      toast("You saved this event!", {
        icon: <FontAwesomeIcon icon={faCalendarPlus} />,
      });
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/events/search?q=${query}&page=1&limit=9`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setEvents(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <EventModal open={openEventModal} onOpenChange={setOpenEventModal} />
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className=" lg:col-span-2">
          <div className="px-4 pt-6">
            <h1 className="text-3xl font-semibold text-stone-600 mb-1">
              Upcoming Events
            </h1>
          </div>
          <Separator className="my-6" />
          <div className="flex gap-4 items-center bg-white border rounded-md">
            <FontAwesomeIcon icon={faSearch} className="pl-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              className="w-full pr-4 py-2 focus:outline-none"
              placeholder="Search events..."
              onChange={handleSearch}
            />
          </div>
          {(user?.role === "SUPERADMIN" || user?.role === "ADMIN") && (
            <Button
              className="mt-6 cursor-pointer"
              onClick={() => setOpenEventModal(true)}
            >
              + New Event
            </Button>
          )}
          {searchQuery === "" ? (
            user?.role === "ADMIN" || user?.role === "SUPERADMIN" ? (
              <Tabs className="mt-6">
                <TabList>
                  <Tab>
                    <div className="flex items-center gap-2 text-gray-500">
                      <FontAwesomeIcon icon={faClock} />
                      <span>Upcoming</span>
                    </div>
                  </Tab>
                  <Tab>
                    <div className="flex items-center gap-2 text-gray-500">
                      <FontAwesomeIcon icon={faCalendar} />
                      <span>My Events</span>
                    </div>
                  </Tab>
                </TabList>
                <TabPanel>
                  <div className="bg-white mt-6 rounded-lg border overflow-hidden">
                    {events.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No events available
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Check back later for upcoming events
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {events.map((event) => (
                          <div
                            key={event.id}
                            className="group relative flex flex-col p-6 transition-colors duration-200"
                          >
                            {/* Event Title */}
                            <div className="flex items-start justify-between mb-2">
                              <Link
                                to={`/events/${event.id}`}
                                className="flex-1 font-semibold text-lg text-gray-900 hover:text-stone-600 transition-colors duration-200 line-clamp-2 decoration-2 underline-offset-2"
                              >
                                {event.title}
                              </Link>

                              {/* Bookmark Button */}
                              <button
                                onClick={() => toggleSaved(event.id)}
                                className={`ml-4 p-2 rounded-full transition-all duration-200 hover:bg-white hover:shadow-sm ${
                                  savedItems[event.id]
                                    ? "text-amber-500 hover:text-amber-600"
                                    : "text-gray-400 hover:text-amber-500"
                                }`}
                                aria-label={
                                  savedItems[event.id]
                                    ? "Remove bookmark"
                                    : "Add bookmark"
                                }
                              >
                                <Bookmark
                                  size={18}
                                  fill={
                                    savedItems[event.id]
                                      ? "currentColor"
                                      : "none"
                                  }
                                  className="transition-transform duration-200 hover:scale-110"
                                />
                              </button>
                            </div>

                            {/* Host Information */}
                            <div className="flex items-center mb-3">
                              <Avatar className="cursor-pointer size-10 border mr-2">
                                <AvatarImage
                                  src={event.host.profilePhoto}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {event.host.firstName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm text-gray-600 font-medium">
                                {event.host.firstName} {event.host.lastName}
                              </p>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                              {event.description}
                            </p>

                            {/* Date and Metadata */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center text-xs text-gray-500">
                                <svg
                                  className="w-4 h-4 mr-1.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {new Date(event.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>

                              {/* Optional: Event status indicator */}
                              <div className="flex items-center">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Upcoming
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="bg-white mt-6 rounded-lg border overflow-hidden">
                    {myEvents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 font-medium">
                          No events available
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Check back later for upcoming events
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {myEvents.map((event) => (
                          <div
                            key={event.id}
                            className="group relative flex flex-col p-6 transition-colors duration-200"
                          >
                            {/* Event Title */}
                            <div className="flex items-start justify-between mb-2">
                              <Link
                                to={`/events/${event.id}`}
                                className="flex-1 font-semibold text-lg text-gray-900 hover:text-stone-600 transition-colors duration-200 line-clamp-2 decoration-2 underline-offset-2"
                              >
                                {event.title}
                              </Link>

                              {/* Bookmark Button */}
                              <button
                                onClick={() => toggleSaved(event.id)}
                                className={`ml-4 p-2 rounded-full transition-all duration-200 hover:bg-white hover:shadow-sm ${
                                  savedItems[event.id]
                                    ? "text-amber-500 hover:text-amber-600"
                                    : "text-gray-400 hover:text-amber-500"
                                }`}
                                aria-label={
                                  savedItems[event.id]
                                    ? "Remove bookmark"
                                    : "Add bookmark"
                                }
                              >
                                <Bookmark
                                  size={18}
                                  fill={
                                    savedItems[event.id]
                                      ? "currentColor"
                                      : "none"
                                  }
                                  className="transition-transform duration-200 hover:scale-110"
                                />
                              </button>
                            </div>

                            {/* Host Information */}
                            <div className="flex items-center mb-3">
                              <Avatar className="cursor-pointer size-10 border mr-2">
                                <AvatarImage
                                  src={event.host.profilePhoto}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {event.host.firstName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm text-gray-600 font-medium">
                                {event.host.firstName} {event.host.lastName}
                              </p>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                              {event.description}
                            </p>

                            {/* Date and Metadata */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                              <div className="flex items-center text-xs text-gray-500">
                                <svg
                                  className="w-4 h-4 mr-1.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {new Date(event.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>

                              {/* Optional: Event status indicator */}
                              <div className="flex items-center">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Upcoming
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabPanel>
              </Tabs>
            ) : (
              <div className="bg-white mt-6 rounded-lg border overflow-hidden">
                {events.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium">
                      No events available
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Check back later for upcoming events
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="group relative flex flex-col p-6 transition-colors duration-200"
                      >
                        {/* Event Title */}
                        <div className="flex items-start justify-between mb-2">
                          <Link
                            to={`/events/${event.id}`}
                            className="flex-1 font-semibold text-lg text-gray-900 hover:text-stone-600 transition-colors duration-200 line-clamp-2 decoration-2 underline-offset-2"
                          >
                            {event.title}
                          </Link>

                          {/* Bookmark Button */}
                          <button
                            onClick={() => toggleSaved(event.id)}
                            className={`ml-4 p-2 rounded-full transition-all duration-200 hover:bg-white hover:shadow-sm ${
                              savedItems[event.id]
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-gray-400 hover:text-amber-500"
                            }`}
                            aria-label={
                              savedItems[event.id]
                                ? "Remove bookmark"
                                : "Add bookmark"
                            }
                          >
                            <Bookmark
                              size={18}
                              fill={
                                savedItems[event.id] ? "currentColor" : "none"
                              }
                              className="transition-transform duration-200 hover:scale-110"
                            />
                          </button>
                        </div>

                        {/* Host Information */}
                        <div className="flex items-center mb-3">
                          <Avatar className="cursor-pointer size-10 border mr-2">
                            <AvatarImage
                              src={event.host.profilePhoto}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {event.host.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm text-gray-600 font-medium">
                            {event.host.firstName} {event.host.lastName}
                          </p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                          {event.description}
                        </p>

                        {/* Date and Metadata */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center text-xs text-gray-500">
                            <svg
                              className="w-4 h-4 mr-1.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>

                          {/* Optional: Event status indicator */}
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Upcoming
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="divide-y divide-gray-100 bg-white mt-6 border rounded-md">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group relative flex flex-col p-6 transition-colors duration-200"
                >
                  {/* Event Title */}
                  <div className="flex items-start justify-between mb-2">
                    <Link
                      to={`/events/${event.id}`}
                      className="flex-1 font-semibold text-lg text-gray-900 hover:text-stone-600 transition-colors duration-200 line-clamp-2 decoration-2 underline-offset-2"
                    >
                      {event.title}
                    </Link>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleSaved(event.id)}
                      className={`ml-4 p-2 rounded-full transition-all duration-200 hover:bg-white hover:shadow-sm ${
                        savedItems[event.id]
                          ? "text-amber-500 hover:text-amber-600"
                          : "text-gray-400 hover:text-amber-500"
                      }`}
                      aria-label={
                        savedItems[event.id]
                          ? "Remove bookmark"
                          : "Add bookmark"
                      }
                    >
                      <Bookmark
                        size={18}
                        fill={savedItems[event.id] ? "currentColor" : "none"}
                        className="transition-transform duration-200 hover:scale-110"
                      />
                    </button>
                  </div>

                  {/* Host Information */}
                  <div className="flex items-center mb-3">
                    <Avatar className="cursor-pointer size-10 border mr-2">
                      <AvatarImage
                        src={event.host.profilePhoto}
                        className="object-cover"
                      />
                      <AvatarFallback>{event.host.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-600 font-medium">
                      {event.host.firstName} {event.host.lastName}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                    {event.description}
                  </p>

                  {/* Date and Metadata */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    {/* Optional: Event status indicator */}
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Upcoming
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
