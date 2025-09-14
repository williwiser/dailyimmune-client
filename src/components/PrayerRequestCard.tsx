import { useState } from "react";
import { PrayerModal } from "./PrayerModal";

interface PrayerRequestCardProps {
  id: string;
  author: string;
  subject: string;
  body: string;
  updatedAt: Date;
  isAnswered: boolean;
}

const PrayerRequestCard = ({
  id,
  author,
  subject,
  body,
  updatedAt,
  isAnswered,
}: PrayerRequestCardProps) => {
  const [showPrayer, setShowPrayer] = useState(false);

  return (
    <div className="bg-white overflow-hidden rounded-md border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl w-[18rem]">
      <div className="p-4 h-60 flex flex-col gap-3">
        <div>
          <div className={`flex justify-end mb-3 `}>
            <span
              className={`${
                isAnswered
                  ? "bg-lime-400/50 border border-lime-600 text-lime-900"
                  : "bg-amber-400/50 border border-amber-600 text-amber-900"
              } text-xs py-1 px-1.5 rounded-full font-semibold w-fit inline-flex justify-center items-center `}
            >
              {isAnswered ? "Answered" : "Still needs prayer"}
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

        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-500">
            {new Date(updatedAt).toLocaleDateString()}
          </span>
          <button
            onClick={() => setShowPrayer((prev) => !prev)}
            className="font-semibold text-[#3B3B1A] text-sm"
          >
            View
          </button>
        </div>
      </div>
      <PrayerModal id={id} open={showPrayer} onOpenChange={setShowPrayer} />
    </div>
  );
};

export default PrayerRequestCard;
