import { Calendar, Edit3, User } from "lucide-react";
import { Link } from "react-router";

interface TestimonyCardProps {
  id: number;
  thumbnail?: string;
  title: string;
  body: string;
  edited: Date;
  author: string;
  status?: string;
  edit?: boolean;
}

const TestimonyCard = ({
  id,
  thumbnail,
  title,
  body,
  edited,
  status,
  author,
  edit,
}: TestimonyCardProps) => {
  return (
    <div className="bg-white overflow-hidden rounded-md shadow-md border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl max-w-[18rem]">
      <div className="relative">
        <img
          src={thumbnail ? thumbnail : "/placeholder.jpg"}
          alt="Testimony Thumbnail"
          className="w-full h-44 object-cover"
        />
        {status === "draft" ? (
          <span className="absolute bottom-4 left-4 bg-white/80 py-0.5 px-2 rounded-full text-sm">
            {status}
          </span>
        ) : null}
        {edit ? (
          <Link to={`/dashboard/testimonies/${id}/edit`}>
            <span className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-sm">
              <Edit3 size={14} />
            </span>
          </Link>
        ) : null}
      </div>
      <div className="p-4 ull flex flex-col">
        <div>
          <h1 className="font-semibold text-gray-800 mb-3 line-clamp-2">
            {title}
          </h1>
          <div className="flex gap-1 items-center">
            <User className="size-4" />
            <span className="text-xs text-gray-500 ">{author}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4 w-full leading-relaxed line-clamp-3">
            {body}
          </p>
        </div>
        <div className="flex justify-between gap-1 text-sm mt-auto mb-2">
          <div className="flex gap-1 items-center mt-auto">
            <Calendar className="size-4" />
            <span className="text-xs text-gray-500 ">
              {new Date(edited).toLocaleDateString()}
            </span>
          </div>
          <Link
            to={`/testimonies/${id}`}
            className="font-semibold text-[#747474]"
          >
            Read
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestimonyCard;
