import axios from "axios";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState } from "react";
import { slugify } from "@/utils/slugify";
import type Post from "@/types/Post";
import { Separator } from "@/components/ui/separator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

type SavedPost = Post<"article">;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MySavedPosts = () => {
  const [posts, setPosts] = useState<SavedPost[]>([]);
  const { user } = useAuth();
  console.log(user);
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const getSavedLink = (savedItem: SavedPost) => {
    return `/posts/${savedItem.id}/${slugify(savedItem.title)}`;
  };

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/posts/me/saved?page=1&limit=12`, {
        withCredentials: true,
      })
      .then((response) => {
        setPosts(response.data);
      });
  }, [user?.id]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <div className=" lg:col-span-2">
        <div className="px-4 pt-6">
          <h1 className="text-3xl font-semibold text-stone-600 mb-1">
            Saved Posts
          </h1>
          <p className="text-gray-500">Your saved content will appear here</p>
        </div>
        <Separator className="my-6" />

        <div className="grid gap-4 mt-6">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 col-span-3 bg-white rounded-md border">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faBookmark} />
              </div>
              <p className="text-gray-500 font-medium">No saved posts here</p>
              <p className="text-gray-400 text-sm mt-1">
                Your saved posts will appear here.
              </p>
            </div>
          ) : (
            posts.map((savedItem: SavedPost) => (
              <div className="flex items-center gap-4 bg-white border px-4 py-6 rounded-md">
                {savedItem.meta.thumbnail ? (
                  <img
                    src={savedItem.meta.thumbnail}
                    className="size-24 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center size-24 bg-stone-300 rounded-md">
                    <FontAwesomeIcon
                      icon={faNewspaper}
                      className="text-xl text-stone-800"
                    />
                  </div>
                )}

                <div className="flex flex-col flex-1 h-full">
                  <p className="text-stone-500 text-sm capitalize-first">
                    {savedItem.type}
                  </p>
                  <Link
                    to={getSavedLink(savedItem)}
                    className="text-2xl font-semibold hover:text-stone-600 transition-all duration-200"
                  >
                    {savedItem.title}
                  </Link>
                  <p className="text-gray-500 flex-1">
                    {truncateText(savedItem.preview, 20)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MySavedPosts;
