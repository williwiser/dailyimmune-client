import { Edit2, Globe2, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckToSlot,
  faClose,
  faHeart,
  faPray,
} from "@fortawesome/free-solid-svg-icons";

interface TestimonyCardProps {
  id: string;
  author: string;
  subject: string;
  body: string;
  edited: Date;
  isAnswered: boolean;
  isPublic?: boolean;
  edit?: boolean;
  onDelete?: (id: string) => void;
}

const PrayerRequestCard = ({
  id,
  subject,
  body,
  edited,
  author,
  isAnswered,
  isPublic,
  edit,
  onDelete,
}: TestimonyCardProps) => {
  const [showPrayer, setShowPrayer] = useState(false);
  const [prayerAnswered, setPrayerAnswered] = useState(isAnswered);
  const [prayingForYou, setPrayingForYou] = useState(false);
  const [prayingCount, setPrayingCount] = useState(0);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleAnsweredPrayer = () => {
    setPrayerAnswered((prev) => !prev);
    axios
      .patch(
        `${BACKEND_URL}/api/v1/prayers/me`,
        { id: id, isAnswered: !isAnswered },
        { withCredentials: true }
      )
      .then((response) => console.log(response.data))
      .catch(() => setPrayerAnswered((prev) => !prev));
  };

  const handlePrayingForYou = () => {
    setPrayingForYou((prev) => !prev);
    setPrayingCount((prev) => (prayingForYou ? prev - 1 : prev + 1));
    axios
      .post(
        `${BACKEND_URL}/api/v1/prayers/new-prayer-interaction/${id}`,
        {},
        { withCredentials: true }
      )
      .then((response) => console.log(response.data));
  };

  const handleDelete = () => {
    if (onDelete) onDelete(id);
  };

  return (
    <div className="bg-white overflow-hidden rounded-md border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl w-[18rem]">
      <div className="p-4 h-60 flex flex-col gap-3">
        <div>
          <div
            className={`flex ${edit ? "justify-between" : "justify-end"} mb-3 `}
          >
            <button
              className={`${
                edit ? "" : "hidden"
              } text-gray-400 rounded-full cursor-pointer hover:text-gray-600 transition-all duration-200`}
            >
              <Edit2 />
            </button>
            <span
              className={`${
                prayerAnswered
                  ? "bg-lime-400/50 border border-lime-600 text-lime-900"
                  : "bg-amber-400/50 border border-amber-600 text-amber-900"
              } text-xs py-1 px-1.5 rounded-full font-semibold w-fit inline-flex justify-center items-center `}
            >
              {prayerAnswered ? "Answered" : "Still needs prayer"}
            </span>
          </div>
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <h1 className="text-lg font-semibold max-w-sm text-nowrap overflow-hidden">
              {subject}
            </h1>
          </div>
          <p className="text-sm text-gray-500 w-full italic mb-4">{author}</p>
          <p className="text-sm text-gray-500 w-full">{body}</p>
        </div>

        {isPublic == undefined ? null : isPublic === false ? (
          <div className="flex gap-1 text-xs items-center">
            <Lock size={12} /> Private
          </div>
        ) : (
          <div className="flex gap-1 text-xs items-center">
            <Globe2 size={12} /> Public
          </div>
        )}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-500">
            {new Date(edited).toLocaleDateString()}
          </span>
          <button
            onClick={() => setShowPrayer((prev) => !prev)}
            className="font-semibold text-[#3B3B1A] text-sm"
          >
            View
          </button>
        </div>
      </div>
      <Dialog open={showPrayer} onOpenChange={setShowPrayer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{subject}</DialogTitle>
            <DialogDescription>
              <span
                className={`${
                  prayerAnswered
                    ? "bg-lime-400/50 border border-lime-600 text-lime-900"
                    : "bg-amber-400/50 border border-amber-600 text-amber-900"
                } text-xs py-1 px-1.5 rounded-full font-semibold w-fit inline-flex justify-center items-center mb-3 mt-1`}
              >
                {prayerAnswered ? "Answered" : "Still needs prayer"}
              </span>
              <p className="italic">Submitted by {author}</p>
            </DialogDescription>
          </DialogHeader>
          <hr />
          <div>
            <p className="text-gray-500 mb-4">{body}</p>
            <div className="flex justify-between">
              <p className="text-xs">
                <FontAwesomeIcon icon={faHeart} className="text-gray-500" />{" "}
                <span className="text-gray-500">{prayingCount} Praying</span>
              </p>
              <p className="text-xs text-gray-500">
                {new Date(edited).toLocaleDateString()}
              </p>
            </div>
          </div>
          <DialogFooter>
            {edit ? (
              prayerAnswered ? (
                <Button onClick={handleAnsweredPrayer}>
                  <FontAwesomeIcon icon={faPray} /> Still need prayer
                </Button>
              ) : (
                <Button onClick={handleAnsweredPrayer}>
                  <FontAwesomeIcon icon={faCheckToSlot} /> Answered
                </Button>
              )
            ) : prayingForYou ? (
              <Button onClick={handlePrayingForYou}>
                <FontAwesomeIcon icon={faClose} /> Remove from prayer list
              </Button>
            ) : (
              <Button onClick={handlePrayingForYou}>
                <FontAwesomeIcon icon={faHeart} /> Praying for you
              </Button>
            )}
            {edit ? (
              <Button variant="ghost" onClick={handleDelete}>
                Remove
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrayerRequestCard;
