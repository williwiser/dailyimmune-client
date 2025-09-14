import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  faClose,
  faHeart,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuth } from "@/context/useAuth";
import { toast, Toaster } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PrayerModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
}

interface PrayerRequest {
  subject: string;
  body: string;
  isAnswered: boolean;
  userIsIntercessor: boolean;
  prayingCount: number;
  updatedAt: Date;
  requester: User | null;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Animation component for floating hearts
const FloatingHeart = ({
  id,
  onComplete,
}: {
  id: number;
  onComplete: (id: number) => void;
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(id);
    }, 2000);
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  return (
    <div
      className="absolute pointer-events-none animate-pulse"
      style={{
        left: `${Math.random() * 80 + 10}%`,
        animation: `floatUp 2s ease-out forwards`,
        animationDelay: `${Math.random() * 0.5}s`,
      }}
    >
      <FontAwesomeIcon icon={faHeart} className="text-stone-400 text-xl" />
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-60px) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export const PrayerModal = ({ id, open, onOpenChange }: PrayerModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);
  const [nextHeartId, setNextHeartId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [prayerRequest, setPrayerRequest] = useState<PrayerRequest>({
    subject: "",
    body: "",
    isAnswered: false,
    userIsIntercessor: false,
    prayingCount: 0,
    updatedAt: new Date(),
    requester: null,
  });

  const handlePrayingForYou = async () => {
    if (!user) {
      toast("You must be logged in to access this feature", {
        icon: <FontAwesomeIcon icon={faUserSlash} />,
      });
      return;
    }
    if (!prayerRequest.userIsIntercessor) {
      // Trigger animation only when adding to prayer list
      setIsAnimating(true);

      // Create multiple hearts
      const newHearts = Array.from({ length: 5 }, (_, i) => nextHeartId + i);
      setHearts((prev) => [...prev, ...newHearts]);
      setNextHeartId((prev) => prev + 5);

      // Reset animation state after a delay
      setTimeout(() => setIsAnimating(false), 1500);
    }
    setPrayerRequest((prev) => ({
      ...prev,
      userIsIntercessor: true,
      prayingCount: prev.prayingCount + 1,
    }));
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/prayers/new-intercession/${id}`,
        {},
        { withCredentials: true }
      );
      toast(
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={prayerRequest.requester?.profilePhoto}
              className="object-cover"
            />
            <AvatarFallback>
              {prayerRequest.requester?.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <span>
            <span className="font-semibold">
              {prayerRequest.requester?.firstName}
            </span>{" "}
            is now in your prayer list
          </span>
        </div>
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemovePrayer = async () => {
    setPrayerRequest((prev) => ({
      ...prev,
      userIsIntercessor: false,
      prayingCount: prev.prayingCount - 1,
    }));
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/prayers/remove-intercession/${id}`,
        {},
        { withCredentials: true }
      );
      toast(
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={prayerRequest.requester?.profilePhoto}
              className="object-cover"
            />
            <AvatarFallback>
              {prayerRequest.requester?.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <span>
            <span className="font-semibold">
              {prayerRequest.requester?.firstName}
            </span>{" "}
            has been removed from your prayer list
          </span>
        </div>
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const removeHeart = (heartId: number) => {
    setHearts((prev) => prev.filter((id) => id !== heartId));
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/prayers/${id}`, { withCredentials: true })
      .then((response) => {
        console.log(response.data.prayerRequest);
        setPrayerRequest(response.data.prayerRequest);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Toaster />
      {isLoading ? (
        <DialogContent>
          <DialogTitle>Loading Prayer Request</DialogTitle>
          <DialogDescription>Please wait...</DialogDescription>
          <div>
            <PulseLoader color="#79716b" />
          </div>
        </DialogContent>
      ) : (
        <DialogContent>
          {hearts.length > 0 && (
            <div className="absolute inset-0 pointer-events-none z-50">
              {hearts.map((heartId) => (
                <FloatingHeart
                  key={heartId}
                  id={heartId}
                  onComplete={removeHeart}
                />
              ))}
            </div>
          )}

          <DialogHeader>
            <DialogTitle>{prayerRequest.subject}</DialogTitle>
            <DialogDescription>
              <span
                className={`${
                  prayerRequest.isAnswered
                    ? "bg-lime-400/50 border border-lime-600 text-lime-900"
                    : "bg-amber-400/50 border border-amber-600 text-amber-900"
                } text-xs py-1 px-1.5 rounded-full font-semibold w-fit inline-flex justify-center items-center mb-3 mt-1`}
              >
                {prayerRequest.isAnswered ? "Answered" : "Still needs prayer"}
              </span>{" "}
              <br />
              <span className="italic">
                Submitted by {prayerRequest.requester?.firstName}{" "}
                {prayerRequest.requester?.lastName}
              </span>
            </DialogDescription>
          </DialogHeader>
          <hr />
          <div>
            <p className="text-gray-500 mb-4">{prayerRequest.body}</p>
            <div className="flex justify-between">
              <p className="text-xs">
                <FontAwesomeIcon icon={faHeart} className="text-gray-500" />{" "}
                <span className="text-gray-500">
                  {prayerRequest.prayingCount} Praying
                </span>
              </p>
              <p className="text-xs text-gray-500">
                {new Date(prayerRequest.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <DialogFooter>
            {prayerRequest.userIsIntercessor ? (
              <Button onClick={handleRemovePrayer}>
                <FontAwesomeIcon icon={faClose} />{" "}
                <span>Remove from prayer list</span>
              </Button>
            ) : (
              <Button
                onClick={handlePrayingForYou}
                className={`transition-all duration-300 ${
                  isAnimating
                    ? "bg-stone-500 hover:bg-stone-600 scale-105 shadow-lg "
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`${
                    isAnimating ? "animate-bounce text-white" : ""
                  }`}
                />{" "}
                <span>Praying for you</span>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
