import { Link } from "react-router";

interface TestimonyCardProps {
  id: number;
  thumbnail?: string;
  title: string;
  body: string;
  edited: Date;
}

const TestimonyCard = ({
  id,
  thumbnail,
  title,
  body,
  edited,
}: TestimonyCardProps) => {
  return (
    <div className="bg-white overflow-hidden rounded-md shadow-md border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl max-w-xs">
      <img
        src={thumbnail == "" ? "/placeholder.jpg" : thumbnail}
        alt="Testimony Thumbnail"
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-sm text-gray-500 w-full">{body}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500 ">
            Last Edited • {new Date(edited).toLocaleDateString()}
          </span>
          <Link
            to={`testimonies/${id}`}
            className="font-semibold text-[#3B3B1A] text-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestimonyCard;
