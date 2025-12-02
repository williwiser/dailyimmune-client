import ReportModal from "@/components/ReportModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/useAuth";
import Container from "@/layouts/Container";
import type { Comment } from "@/types/Comment";
import type Post from "@/types/Post";
import { slugify } from "@/utils/slugify";
import {
  faBookmark,
  faCopy,
  faEllipsisVertical,
  faHeart,
  faHeartCircleMinus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { motion } from "framer-motion";
import { Bookmark, Edit, Heart, Calendar } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";
import { toast, Toaster } from "sonner";

type Testimony = Post<"testimony">;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface CommentData {
  body: string;
}

// Mock data for preview
const emptyPost: Testimony = {
  id: "",
  title: "",
  authorId: "",
  preview: "",
  type: "testimony",
  body: "",
  meta: {},
  likes: 0,
  saves: 0,
  isLiked: false,
  isSaved: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  author: {
    firstName: "",
    lastName: "",
    profilePhoto: "",
  },
  status: "pending",
};

const Comment = ({
  comment,
  onDelete,
  onOpenChange,
  setSelectedComment,
}: {
  comment: Comment;
  onDelete: (id: string) => void;
  open: boolean;
  onOpenChange: (state: boolean) => void;
  setSelectedComment: (comment: Comment | null) => void;
}) => {
  const { user } = useAuth();
  setSelectedComment(comment);
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <Avatar className="cursor-pointer border mt-1">
          <AvatarImage
            src={comment.postedBy?.profilePhoto}
            className="object-cover"
          />
          <AvatarFallback>{comment.postedBy?.firstName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="mb-1">
            <p className="font-semibold text-gray-900">
              {comment.postedBy?.firstName} {comment.postedBy?.lastName}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }).format(new Date(comment.createdAt))}
              </span>
            </div>
          </div>
          <p className="text-gray-800 text-sm">{comment.body}</p>
        </div>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onOpenChange(true)}>
            Report
          </DropdownMenuItem>
          {comment.postedBy?.id === user?.id ? (
            <DropdownMenuItem onClick={() => onDelete(comment.id)}>
              Delete
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const Article = () => {
  const { id } = useParams();
  const [testimony, setTestimony] = useState<Testimony>(emptyPost);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentData, setCommentData] = useState<CommentData>({ body: "" });
  const [showCommentButtons, setShowCommentButtons] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/posts/${id}`, { withCredentials: true })
      .then((response) => {
        setTestimony(response.data);
        setLikes(response.data.likes);
        setLiked(response.data.isLiked);
        setSaved(response.data.isSaved);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/posts/${id}/comments`)
      .then((res) => {
        setComments(res.data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleReport = (
    comment: Comment | null,
    formData: { reason: string; description: string }
  ) => {
    toast.loading("Submitting report...");
    if (!comment) {
      toast.dismiss();
      toast.error("Oops, something went wrong");
      return;
    }
    axios
      .post(
        `${BACKEND_URL}/api/v1/reports/${comment.postedBy.id}/comments/${comment.id}`,
        formData,
        { withCredentials: true }
      )
      .then(() => {
        setShowReportModal(false);
        setComments((prev) => prev.filter((comm) => comm.id !== comment.id));
        toast.dismiss();
        toast.success("Comment has been reported to administrators");
      })
      .catch((err) => {
        console.log(err);
        toast.dismiss();
        toast.error("Oops, something went wrong");
      });
  };

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteComment = (id: string) => {
    toast.loading("Deleting comment...");
    axios
      .delete(`${BACKEND_URL}/api/v1/posts/comments/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.dismiss();
        toast.success("Comment has been deleted", {
          icon: <FontAwesomeIcon icon={faTrash} />,
        });
        setComments((prev) => prev.filter((comment) => comment.id !== id));
      })
      .catch(() => {
        toast.dismiss();
        toast.error("Oops something went wrong");
      });
  };

  const handleShare = () => {
    let shareUrl = "";
    if (navigator.share) {
      navigator
        .share({
          title: testimony.title,
          text: `Read this post: ${testimony.title}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      if (testimony.type === "testimony") {
        shareUrl = `${window.location.origin}/testimonies/${
          testimony.id
        }/${slugify(testimony.title)}`;
      } else if (testimony.type === "devotional") {
        shareUrl = `${window.location.origin}/devotionals/${
          testimony.id
        }/${slugify(testimony.title)}`;
      }

      navigator.clipboard
        .writeText(shareUrl)
        .then(() =>
          toast("Link copied to clipboard!", {
            icon: <FontAwesomeIcon icon={faCopy} />,
          })
        )
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  const toggleSaved = () => {
    if (!user) {
      toast.error("You must be logged in to save posts");
      return;
    }
    setSaved((prev) => !prev);

    if (saved) {
      toast("Post removed from saves", {
        icon: <FontAwesomeIcon icon={faBookmark} />,
      });
      axios.delete(`${BACKEND_URL}/api/v1/posts/${id}/unsave`, {
        withCredentials: true,
      });
    } else {
      toast("You saved this post!", {
        icon: <FontAwesomeIcon icon={faBookmark} />,
      });
      axios.post(
        `${BACKEND_URL}/api/v1/posts/${id}/save`,
        {},
        {
          withCredentials: true,
        }
      );
    }
  };

  const toggleLiked = () => {
    if (!user) {
      toast.error("You must be logged in to like posts");
      return;
    }

    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    if (liked) {
      toast("Post removed from likes", {
        icon: <FontAwesomeIcon icon={faHeartCircleMinus} />,
      });
      axios.delete(`${BACKEND_URL}/api/v1/posts/${id}/unlike`, {
        withCredentials: true,
      });
    } else {
      toast("You liked this post!", {
        icon: <FontAwesomeIcon icon={faHeart} />,
      });
      axios.post(
        `${BACKEND_URL}/api/v1/posts/${id}/like`,
        {},
        {
          withCredentials: true,
        }
      );
    }
  };

  const handleCommentSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingComment(true);
    axios
      .post(`${BACKEND_URL}/api/v1/posts/${id}/comments`, commentData, {
        withCredentials: true,
      })
      .then((res) => {
        setComments((prev) => [
          {
            ...res.data,
            createdAt: new Date(res.data.createdAt),
            updatedAt: new Date(res.data.updatedAt),
            postedBy: {
              id: user?.id,
              profilePhoto: user?.profilePhoto,
              firstName: user?.firstName,
              lastName: user?.lastName,
            },
          },
          ...prev,
        ]);
        setCommentData({ body: "" });
        setShowCommentButtons(false);
        toast.success("Your comment has been published!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Oops, something went wrong");
      })
      .finally(() => setSubmittingComment(false));
  };

  return isLoading ? (
    <main className="flex h-screen justify-center items-center">
      <PulseLoader color="#79716b" />
    </main>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white ">
      <Toaster />
      <ReportModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        onSubmit={handleReport}
        comment={selectedComment}
      />
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `url('${
              testimony.meta.thumbnail || "/placeholder.jpg"
            }')`,
          }}
        />
        <div className="absolute inset-0 md:bg-gradient-to-b from-black/40 via-black/20 to-white" />

        {/* Floating Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          {user && user.id === testimony.authorId && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Link
                to={`/dashboard/${
                  testimony.type === "devotional"
                    ? "devotionals"
                    : "testimonies"
                }/${testimony.id}/edit`}
              >
                <Edit className="w-5 h-5 text-gray-700" />
              </Link>
            </motion.button>
          )}
          <motion.button
            onClick={toggleSaved}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Bookmark
              fill={saved ? "#DAA520" : "transparent"}
              className={`w-5 h-5 transition-colors ${
                saved ? "text-amber-500" : "text-gray-700"
              }`}
            />
          </motion.button>
        </div>
      </div>

      {/* Article Content */}
      <Container>
        <div className="mx-auto md:px-6 -mt-32 relative z-10">
          <article className="bg-white md:border md:rounded-2xl overflow-hidden">
            {/* Header Section */}
            <div className="p-8 md:p-12 border-b border-gray-100">
              <span className="text-stone-500 uppercase text-sm bg-gray-100 px-4 py-2 rounded-full">
                {testimony.type}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight mt-8">
                {testimony.title}
              </h1>

              {/* Author & Meta Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="cursor-pointer border">
                    <AvatarImage
                      src={testimony.author.profilePhoto}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {testimony.author.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {testimony.author.firstName} {testimony.author.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(testimony.createdAt))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Like Button */}
                <motion.button
                  onClick={toggleLiked}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer w-fit flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors shadow-sm"
                >
                  <motion.div
                    animate={{
                      scale: liked ? [1, 1.3, 1] : 1,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    <Heart
                      fill={liked ? "#DC143C" : "transparent"}
                      className={`w-6 h-6 transition-colors ${
                        liked ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                  </motion.div>
                  <span className="text-lg font-semibold text-gray-700">
                    {likes}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                {testimony.body.split("\n\n").map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-gray-700 leading-relaxed mb-6 text-lg whitespace-pre-line"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Footer Section */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-600">Did you find this inspiring?</p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="cursor-pointer px-6 py-2 bg-white border border-gray-200 rounded-full font-medium text-gray-700 hover:border-gray-300 transition-colors"
                  >
                    Share
                  </motion.button>
                  <Link
                    to={
                      testimony.type === "devotional"
                        ? "/devotionals"
                        : "/testimonies"
                    }
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer px-6 py-2 bg-gradient-to-r from-stone-500 to-stone-600 text-white rounded-full font-medium hover:shadow-md transition-shadow"
                    >
                      Read More Stories
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </article>
          <div className="md:mt-12 md:border md:rounded-2xl overflow-hidden">
            <h1 className="font-semibold text-2xl mb-6 bg-gradient-to-br from-gray-50 to-stone-50 px-6 py-12 md:p-6 ">
              Comments
            </h1>
            <div className="px-6 py-4">
              <form
                className="flex flex-col gap-4 mb-6"
                onSubmit={handleCommentSubmit}
              >
                <input
                  name="body"
                  type="text"
                  placeholder={
                    comments.length === 0
                      ? "Be the first to drop a comment..."
                      : "Drop your comment here..."
                  }
                  value={commentData.body}
                  onFocus={() => setShowCommentButtons(true)}
                  onChange={handleCommentChange}
                  autoComplete="off"
                  disabled={user ? false : true}
                  className="border-b focus:border-b-2 disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-gray-800 focus:outline-0 w-full py-3 text-sm"
                />
                <div className="flex justify-end items-center w-full">
                  <div
                    className={`${
                      showCommentButtons ? "flex" : "hidden"
                    } gap-2`}
                  >
                    <button
                      type="button"
                      className="text-sm cursor-pointer px-6 py-2 rounded-full font-semibold hover:text-stone-700 transition-shadow w-fit"
                      onClick={(e) => {
                        e.preventDefault();
                        setCommentData({ body: "" });
                        setShowCommentButtons(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        commentData.body.length === 0 || submittingComment
                      }
                      className="text-sm cursor-pointer disabled:cursor-not-allowed px-6 py-2 bg-stone-500 disabled:bg-gray-300 disabled:text-gray-600 text-white rounded-full font-semibold hover:shadow-md disabled:hover:shadow-none transition-shadow w-fit"
                    >
                      {submittingComment ? <PulseLoader /> : "Comment"}
                    </button>
                  </div>
                </div>
              </form>

              <ul className="flex flex-col gap-6">
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <Comment
                      comment={comment}
                      onDelete={handleDeleteComment}
                      open={showReportModal}
                      onOpenChange={setShowReportModal}
                      setSelectedComment={setSelectedComment}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Related or Additional Content Placeholder */}
          <div className="mt-12 mb-16 text-center text-gray-500">
            <p className="text-sm">More amazing posts coming soon...</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Article;
