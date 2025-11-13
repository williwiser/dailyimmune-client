import { faEarth, faPen, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Link } from "react-router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import DevotionalCard from "@/components/DevotionalCard";
import PulseLoader from "react-spinners/PulseLoader";
import { Separator } from "@/components/ui/separator";
import type Post from "@/types/Post";

type Devotional = Omit<Post<"devotional">, "body">;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyDevotionals = () => {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [drafts, setDrafts] = useState<Devotional[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleDelete = (postId: string) => {
    axios
      .delete(`${BACKEND_URL}/api/v1/posts/${postId}`, {
        withCredentials: true,
      })
      .then(() => {
        setDevotionals((prev) =>
          prev.filter((post: Devotional) => post.id !== postId)
        );
        toast.success("Devotional removed successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Devotional could not be deleted");
      });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsLoading(true);
    axios
      .get(
        `${BACKEND_URL}/api/v1/posts/me/search?q=${query}&type=devotional&page=1&limit=12`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setDevotionals(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/posts/me?type=devotional&status=published&page=1&limit=10`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setDevotionals(response.data);
      });
  }, [user?.id]);

  useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/posts/me?type=devotional&status=draft&page=1&limit=10`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setDrafts(response.data);
      });
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <div className=" lg:col-span-2">
        <div className="px-4 pt-6">
          <h1 className="text-3xl font-semibold text-stone-600 mb-1">
            My Devotionals
          </h1>
          <p className="text-gray-500">
            Your devotionals will appear here. NB: Only admins can access this
            feature
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex gap-4 items-center bg-white border rounded-md">
          <FontAwesomeIcon icon={faSearch} className="pl-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            className="w-full pr-4 py-2 focus:outline-none"
            placeholder="Search devotionals..."
            onChange={handleSearch}
          />
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center p-24">
            <PulseLoader color="#79716b" />
          </div>
        ) : searchQuery === "" ? (
          <Tabs className="mt-6">
            <TabList>
              <Tab>
                <div className="flex items-center gap-2 text-gray-500">
                  <FontAwesomeIcon icon={faPen} />
                  <span>Drafts</span>
                </div>
              </Tab>
              <Tab>
                <div className="flex items-center gap-2 text-gray-500">
                  <FontAwesomeIcon icon={faEarth} />
                  <span>Published</span>
                </div>
              </Tab>
            </TabList>

            <TabPanel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
                {drafts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 col-span-3 bg-white rounded-md border">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FontAwesomeIcon icon={faPen} />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No devotionals available
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      <Link
                        to={`/dashboard/devotionals/new`}
                        className="font-semibold underline"
                      >
                        Click here
                      </Link>{" "}
                      to create a new devotional.
                    </p>
                  </div>
                ) : (
                  drafts.map((draft: Devotional) => (
                    <div className="flex justify-center">
                      <DevotionalCard
                        key={draft.id}
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
            </TabPanel>
            <TabPanel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
                {devotionals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 col-span-3 bg-white rounded-md border">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FontAwesomeIcon icon={faPen} />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No devotionals available
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      <Link
                        to={`/dashboard/devotionals/new`}
                        className="font-semibold underline"
                      >
                        Click here
                      </Link>{" "}
                      to create a new devotional.
                    </p>
                  </div>
                ) : (
                  devotionals.map((devotional: Devotional) => (
                    <div className="flex justify-center">
                      <DevotionalCard
                        key={devotional.id}
                        id={devotional.id}
                        thumbnail={devotional.meta.thumbnail}
                        title={devotional.title}
                        body={devotional.preview}
                        edited={devotional.updatedAt}
                        author={`${devotional.author.firstName} ${devotional.author.lastName}`}
                        status={devotional.status}
                        edit
                        onDelete={handleDelete}
                      />
                    </div>
                  ))
                )}
              </div>{" "}
            </TabPanel>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
            {devotionals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 col-span-3 bg-white rounded-md border">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faPen} />
                </div>
                <p className="text-gray-500 font-medium">
                  No devotionals available
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  <Link
                    to={`/dashboard/devotionals/new`}
                    className="font-semibold underline"
                  >
                    Click here
                  </Link>{" "}
                  to create a new devotional.
                </p>
              </div>
            ) : (
              devotionals.map((devotional: Devotional) => (
                <div className="flex justify-center">
                  <DevotionalCard
                    key={devotional.id}
                    id={devotional.id}
                    thumbnail={devotional.meta.thumbnail}
                    title={devotional.title}
                    body={devotional.preview}
                    edited={devotional.updatedAt}
                    author={`${devotional.author.firstName} ${devotional.author.lastName}`}
                    status={devotional.status}
                    edit
                    onDelete={handleDelete}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDevotionals;
