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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/useAuth";
import Container from "@/layouts/Container";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Calendar, Clock, Users, Video, User, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface User {
  id: string;
  profilePhoto?: string;
  firstName: string;
  lastName: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  additionalNotes: string;
  duration: string;
  date: Date;
  host: User;
}

const EventInfo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [event, setEvent] = useState<Event>({
    id: "",
    title: "",
    additionalNotes: "",
    host: { id: "", firstName: "", lastName: "", profilePhoto: undefined },
    description: "",
    date: new Date("2025-09-15T19:00:00"),
    duration: "2 hours",
  });

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/events/${id}`).then((response) => {
      setEvent(response.data);
    });
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100">
      <Container>
        {/* Header Section */}
        <div className="bg-white rounded-md border overflow-hidden mb-8">
          {/* Hero Banner */}
          <div className="bg-stone-200 h-32 relative">
            <div className="absolute inset-0 bg-opacity-10"></div>
            <div className="absolute bottom-4 left-6">
              <span className="bg-stone-800 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                Live Stream
              </span>
            </div>
          </div>

          {/* Event Header */}
          <div className="p-8">
            <div className="mb-4">
              <small className="text-stone-500 font-medium tracking-wider uppercase text-xs">
                Event Title
              </small>
              <h1 className="font-bold text-4xl text-stone-800 mt-1 leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Host Information */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="cursor-pointer size-10 shadow-sm">
                <AvatarImage
                  src={event.host.profilePhoto}
                  className="object-cover"
                />
                <AvatarFallback>{event.host.firstName[0]}</AvatarFallback>
              </Avatar>

              <div>
                <p className="text-stone-700 font-medium">
                  Hosted by {event.host.firstName} {event.host.lastName}
                </p>
                <p className="text-stone-500 text-sm">Administrator</p>
              </div>
            </div>

            {/* Event Description */}
            <div className="mb-8">
              <p className="text-stone-600 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                <Calendar className="w-5 h-5 text-stone-700" />
                <div>
                  <p className="text-stone-500 text-sm">Date</p>
                  <p className="font-medium text-stone-800">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                <Clock className="w-5 h-5 text-stone-700" />
                <div>
                  <p className="text-stone-500 text-sm">Time & Duration</p>
                  <p className="font-medium text-stone-800">
                    {new Date(event.date).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <p className="text-stone-600 text-sm">{event.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                <Video className="w-5 h-5 text-stone-700" />
                <div>
                  <p className="text-stone-500 text-sm">Platform</p>
                  <p className="font-medium text-stone-800">Livestream</p>
                  <p className="text-stone-600 text-sm">Online Event</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg">
                <Users className="w-5 h-5 text-stone-700" />
                <div>
                  <p className="text-stone-500 text-sm">Saves</p>
                  <p className="font-medium text-stone-800">12</p>
                  <p className="text-stone-600 text-sm">Saved this event</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {event.host.id === user?.id ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="cursor-pointer bg-black hover:bg-gray-800 text-white px-8 py-3 font-medium rounded-md hover:shadow-xl transition-all duration-200 flex-1 sm:flex-initial">
                      <FontAwesomeIcon icon={faWifi} />
                      Start Live Stream
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Start Livestream?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will notify all participants that the livestream
                        for this event has started.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => navigate(`/livestream/${event.id}`)}
                      >
                        Start Livestream
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  onClick={() =>
                    navigate(`/livestream/watch/${event.id}`, {
                      state: {
                        title: event.title,
                        host: event.host,
                        description: event.description,
                      },
                    })
                  }
                  className="cursor-pointer bg-stone-700 hover:bg-stone-800 text-white px-8 py-3 font-medium rounded-md hover:shadow-xl transition-all duration-200 flex-1 sm:flex-initial"
                  // disabled={
                  //   new Date(event.date).toLocaleDateString() !==
                  //   new Date().toLocaleDateString()
                  // }
                >
                  Join Live Stream
                </Button>
              )}
              <Button
                variant="outline"
                className="border-stone-300 text-stone-700 hover:bg-stone-50 px-8 py-3 font-medium rounded-md border-2 hover:border-stone-400 transition-all duration-200"
              >
                Set Reminder
              </Button>
              <Button
                variant="outline"
                className="border-stone-300 text-stone-700 hover:bg-stone-50 px-8 py-3 font-medium rounded-lg border-2 hover:border-stone-400 transition-all duration-200"
              >
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* What to Expect */}
          <div className="lg:col-span-2 bg-white rounded-md border p-8">
            <h2 className="text-2xl font-bold text-stone-800 mb-6">
              What to Expect
            </h2>
            <div className="space-y-4 text-stone-600 leading-relaxed">
              <p>
                Join us for this interactive online workshop designed to provide
                you with practical tools and strategies for overcoming
                destructive patterns and building healthier relationships.
                Participate from the comfort of your home!
              </p>
              <div className="space-y-3">
                <h3 className="font-semibold text-stone-700">
                  Live Stream Features:
                </h3>
                <ul className="space-y-2 text-stone-600">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-stone-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Interactive Q&A sessions with the host</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-stone-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Live chat with other participants</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-stone-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Downloadable resources and worksheets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-stone-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Recording available for 48 hours after the event
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Event Stats & Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-md border p-6">
              <h3 className="font-semibold text-stone-800 mb-4">
                Event Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Stream Status</span>
                  <span
                    className={`font-medium ${
                      new Date(event.date).toLocaleDateString() ===
                      new Date().toLocaleDateString()
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {new Date(event.date).toLocaleDateString() ===
                    new Date().toLocaleDateString()
                      ? "Ready"
                      : "Upcoming"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Saves</span>
                  <span className="text-stone-800 font-medium">0</span>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-md border p-6">
              <h3 className="font-semibold text-stone-800 mb-4">
                About the Organizer
              </h3>
              <div className="text-stone-600 space-y-2 text-sm">
                <p>
                  <strong className="text-stone-700">
                    {event.host.firstName} {event.host.lastName}
                  </strong>{" "}
                  is a certified life coach with over 8 years of experience in
                  personal development and addiction recovery.
                </p>
                <p className="text-stone-500">
                  Has hosted 50+ online workshops reaching over 2,000
                  participants globally.
                </p>
              </div>
            </div>

            {/* Technical Requirements */}
            <div className="bg-white rounded-md border p-6">
              <h3 className="font-semibold text-stone-800 mb-4">
                Technical Requirements
              </h3>
              <div className="text-stone-600 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  Stable internet connection
                </p>
                <p className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  Computer, tablet, or smartphone
                </p>
                <p className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  Modern web browser
                </p>
                <p className="text-stone-500 text-xs mt-3">
                  Stream link will be sent 1 hour before the event
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-md border p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Need Help?</h3>
              <p className="text-stone-600 text-sm mb-3">
                Have questions about this event? We're here to help.
              </p>
              <Button
                variant="outline"
                className="w-full border-gray-300 text-stone-700 hover:bg-stone-50"
              >
                Contact Organizer
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EventInfo;
