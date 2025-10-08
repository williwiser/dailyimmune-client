import { slugify } from "@/utils/slugify";
import {
  faBookmark,
  faEllipsisVertical,
  faShareAlt,
  faTrashCan,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Calendar, Edit3 } from "lucide-react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface TestimonyCardProps {
  id: string;
  thumbnail?: string;
  title: string;
  body: string;
  edited: Date;
  author: string;
  status?: string;
  edit?: boolean;
  onDelete?: (id: string) => void;
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
  onDelete,
}: TestimonyCardProps) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const handleDelete = () => {
    if (onDelete) onDelete(id);
  };

  return (
    <>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-pretty">
            If you delete this post, it will be gone forever. This means all
            text, and images connected to it will be permanently removed and
            cannot be restored.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="group flex flex-col bg-white overflow-hidden rounded-xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gray-100 w-full max-w-[20rem] h-[26rem] cursor-pointer">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={thumbnail ? thumbnail : "/placeholder.jpg"}
            alt="Testimony Thumbnail"
            className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          {status === "draft" && (
            <span className="absolute bottom-3 left-3 bg-amber-100 text-amber-800 py-1 px-3 rounded-full text-xs font-medium border border-amber-200">
              Draft
            </span>
          )}

          {/* Edit Button */}
          {edit && (
            <Link to={`/dashboard/testimonies/${id}/edit`}>
              <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-gray-700 hover:bg-white hover:shadow-md transition-all duration-200 group/edit">
                <Edit3
                  size={16}
                  className="group-hover/edit:text-blue-600 transition-colors"
                />
              </span>
            </Link>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-col h-full p-5">
          {/* Header with Title and Menu */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight group-hover:text-stone-600 transition-colors duration-200">
              {title}
            </h2>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className="text-gray-400 hover:text-gray-600 transition-colors w-4 h-4"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem className="cursor-pointer gap-3 py-2.5">
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className="w-4 h-4 text-gray-500"
                  />
                  <span>Save</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-3 py-2.5">
                  <FontAwesomeIcon
                    icon={faShareAlt}
                    className="w-4 h-4 text-gray-500"
                  />
                  <span>Share</span>
                </DropdownMenuItem>
                {edit && (
                  <DropdownMenuItem
                    className="cursor-pointer gap-3 py-2.5 text-red-600 focus:text-red-600"
                    onClick={() => setShowDeleteAlert(true)}
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon
                icon={faUser}
                className="w-4 h-4 text-gray-400"
              />
              <span className="font-medium">{author}</span>
            </div>
          </div>

          {/* Body Text */}
          <div className="flex-grow mb-4">
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
              {body}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(edited).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <Link
              to={`/testimonies/${id}/${slugify(title)}`}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group/read"
            >
              Read more
              <svg
                className="w-4 h-4 ml-1 transition-transform group-hover/read:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonyCard;
