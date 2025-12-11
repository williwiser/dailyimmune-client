import { faEarth, faPen, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Link } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";
import { Separator } from "@/components/ui/separator";
import type Post from "@/types/Post";
import PostCard from "@/components/PostCard";

type PostPreview = Omit<Post<"article">, "body">;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyPosts = () => {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [drafts, setDrafts] = useState<PostPreview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // new: controlled tab state
  const [activeTab, setActiveTab] = useState<"drafts" | "published">(
    "published"
  );

  const handleDelete = (postId: string) => {
    axios
      .delete(`${BACKEND_URL}/api/v1/posts/${postId}`, {
        withCredentials: true,
      })
      .then(() => {
        setPosts((prev) =>
          prev.filter((post: PostPreview) => post.id !== postId)
        );
        setDrafts((prev) =>
          prev.filter((post: PostPreview) => post.id !== postId)
        );
        toast.success("Post removed successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Post could not be deleted");
      });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/posts/me/search?q=${query}&page=1&limit=12`, {
        withCredentials: true,
      })
      .then((response) => {
        setPosts(response.data);
        // when searching, show published results by default
        setActiveTab("published");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/posts/me?status=published&page=1&limit=10`, {
        withCredentials: true,
      })
      .then((response) => {
        setPosts(response.data);
      });
  }, [user?.id]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/posts/me?status=draft&page=1&limit=10`, {
        withCredentials: true,
      })
      .then((response) => {
        setDrafts(response.data);
      });
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 p-4 md:p-0">
      <div className=" lg:col-span-2">
        <div className="px-4 pt-6">
          <h1 className="text-3xl font-semibold text-stone-600 mb-1">
            My Posts
          </h1>
          <p className="text-gray-500">Your posts will appear here.</p>
        </div>
        <Separator className="my-6" />
        <div className="flex gap-4 items-center bg-white border rounded-md">
          <FontAwesomeIcon icon={faSearch} className="pl-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            className="w-full pr-4 py-2 focus:outline-none"
            placeholder="Search posts..."
            onChange={handleSearch}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-24">
            <PulseLoader color="#79716b" />
          </div>
        ) : (
          <>
            {/* Minimalist tab controls */}
            <div
              className="mt-6 flex items-center justify-start gap-2"
              role="tablist"
              aria-label="My posts tabs"
            >
              <button
                role="tab"
                aria-selected={activeTab === "published"}
                aria-controls="tab-published"
                id="tab-btn-published"
                onClick={() => setActiveTab("published")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === "published"
                    ? "bg-gray-900 text-white shadow"
                    : "bg-white text-gray-600 border"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faEarth} />
                  <span>Published</span>
                </div>
              </button>

              <button
                role="tab"
                aria-selected={activeTab === "drafts"}
                aria-controls="tab-drafts"
                id="tab-btn-drafts"
                onClick={() => setActiveTab("drafts")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === "drafts"
                    ? "bg-gray-900 text-white shadow"
                    : "bg-white text-gray-600 border"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPen} />
                  <span>Drafts</span>
                </div>
              </button>
            </div>

            {/* Tab panels */}
            <div className="mt-6">
              <section
                id="tab-drafts"
                role="tabpanel"
                aria-labelledby="tab-btn-drafts"
                hidden={activeTab !== "drafts"}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {drafts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 col-span-full bg-white rounded-md border">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FontAwesomeIcon icon={faPen} />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No posts available
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        <Link
                          to={`/posts/new`}
                          className="font-semibold underline"
                        >
                          Click here
                        </Link>{" "}
                        to create a new post.
                      </p>
                    </div>
                  ) : (
                    drafts.map((draft: PostPreview) => (
                      <div key={draft.id} className="flex justify-center">
                        <PostCard
                          id={draft.id}
                          thumbnail={draft.meta.thumbnail}
                          title={draft.title}
                          body={draft.preview}
                          edited={draft.updatedAt}
                          author={`${draft.author.firstName} ${draft.author.lastName}`}
                          status={draft.status}
                          edit
                          onDelete={handleDelete}
                        />
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section
                id="tab-published"
                role="tabpanel"
                aria-labelledby="tab-btn-published"
                hidden={activeTab !== "published"}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 col-span-full bg-white rounded-md border">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FontAwesomeIcon icon={faPen} />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No posts available
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        <Link
                          to={`/posts/new`}
                          className="font-semibold underline"
                        >
                          Click here
                        </Link>{" "}
                        to create a new post.
                      </p>
                    </div>
                  ) : (
                    posts.map((post: PostPreview) => (
                      <div key={post.id} className="flex justify-center">
                        <PostCard
                          id={post.id}
                          thumbnail={post.meta.thumbnail}
                          title={post.title}
                          body={post.preview}
                          edited={post.updatedAt}
                          author={`${post.author.firstName} ${post.author.lastName}`}
                          status={post.status}
                          edit
                          onDelete={handleDelete}
                        />
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
