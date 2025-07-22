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
      <div className="flex flex-col bg-white overflow-hidden rounded-md  border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl w-[18rem] h-96">
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
        <div className="flex flex-col h-full p-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <h1 className="font-semibold text-gray-800 line-clmap-2">
                {title}
              </h1>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger>
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    className="cursor-pointer text-gray-500 hover:text-gray-600"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="cursor-pointer">
                    <FontAwesomeIcon icon={faBookmark} />
                    Save
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <FontAwesomeIcon icon={faShareAlt} />
                    Share
                  </DropdownMenuItem>
                  {edit && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setShowDeleteAlert(true)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-2 items-center mb-1 text-xs">
              <FontAwesomeIcon icon={faUser} />
              <span className="text-xs text-gray-500 ">{author}</span>
            </div>
            <p className="text-xs text-gray-500 w-full leading-relaxed line-clamp-3">
              {body}
            </p>
          </div>
          <div className="flex justify-between gap-1 text-sm mt-auto mb-2">
            <div className="flex gap-1 items-center">
              <Calendar className="size-4" />
              <span className="text-xs text-gray-500 ">
                {new Date(edited).toLocaleDateString()}
              </span>
            </div>
            <Link
              to={`/testimonies/${id}/${slugify(title)}`}
              className="font-semibold text-[#747474]"
            >
              Read
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonyCard;
