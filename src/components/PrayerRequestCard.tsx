import { Link } from "react-router";

interface TestimonyCardProps {
  id: number;
  author: string;
  subject: string;
  body: string;
  edited: Date;
}

const PrayerRequestCard = ({
  id,
  subject,
  body,
  edited,
}: TestimonyCardProps) => {
  return (
    <div className="bg-white overflow-hidden rounded-md shadow-md border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl max-w-[18rem]">
      <div className="p-4 max-h-44 flex flex-col">
        <div>
          <h1 className="text-lg font-semibold">{subject}</h1>
          <p className="text-sm text-gray-500 w-full">{body}</p>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-500 ">
            {new Date(edited).toLocaleDateString()}
          </span>
          <Link to={`${id}`} className="font-semibold text-[#3B3B1A] text-sm">
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrayerRequestCard;
