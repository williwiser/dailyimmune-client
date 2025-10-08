import TestimonyCard from "@/components/TestimonyCard";
import { faEarth, faPen, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Link } from "react-router";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import PulseLoader from "react-spinners/PulseLoader";
import { Separator } from "@/components/ui/separator";

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

type Testimony = {
  id: string;
  title: string;
  body: string;
  thumbnail: string;
  updatedAt: Date;
  user: User;
  status: string;
  // add other properties if needed
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyTestimonies = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  console.log(user);
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleDelete = (postId: string) => {
    axios
      .delete(`${BACKEND_URL}/api/v1/testimonies/${postId}`, {
        withCredentials: true,
      })
      .then(() => {
        setTestimonies((prev) =>
          prev.filter((post: Testimony) => post.id !== postId)
        );
        toast.success("Testimony removed successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Testimony could not be deleted");
      });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsLoading(true);
    axios
      .get(
        `${BACKEND_URL}/api/v1/testimonies/me/search?q=${query}&page=1&limit=12`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setTestimonies(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/testimonies?authorId=${user?.id}&page=1&limit=10`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setTestimonies(response.data);
      });
  }, [user?.id]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/drafts?&page=1&limit=10`, {
        withCredentials: true,
      })
      .then((response) => {
        setDrafts(response.data);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <div className=" lg:col-span-2">
        <div className="px-4 pt-6">
          <h1 className="text-3xl font-semibold text-stone-600 mb-1">
            My Testimonies
          </h1>
          <p className="text-gray-500">
            Manage your draft and published testimonies
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex gap-4 items-center bg-white border rounded-md">
          <FontAwesomeIcon icon={faSearch} className="pl-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            className="w-full pr-4 py-2 focus:outline-none"
            placeholder="Search testimonies..."
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
                      No testimonies available
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      <Link
                        to={`/dashboard/testimonies/new`}
                        className="font-semibold underline"
                      >
                        Click here
                      </Link>{" "}
                      to create a new testimony.
                    </p>
                  </div>
                ) : (
                  drafts.map((draft: Testimony) => (
                    <div className="flex justify-center">
                      <TestimonyCard
                        key={draft.id}
                        id={draft.id}
                        thumbnail={draft.thumbnail}
                        title={draft.title}
                        body={truncateText(draft.body, 15)}
                        edited={draft.updatedAt}
                        author={`${draft.user.firstName} ${draft.user.lastName}`}
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
                {testimonies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6 col-span-3 bg-white rounded-md border">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FontAwesomeIcon icon={faPen} />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No testimonies available
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      <Link
                        to={`/dashboard/testimonies/new`}
                        className="font-semibold underline"
                      >
                        Click here
                      </Link>{" "}
                      to create a new testimony.
                    </p>
                  </div>
                ) : (
                  testimonies.map((testimony: Testimony) => (
                    <div className="flex justify-center">
                      <TestimonyCard
                        key={testimony.id}
                        id={testimony.id}
                        thumbnail={testimony.thumbnail}
                        title={testimony.title}
                        body={truncateText(testimony.body, 15)}
                        edited={testimony.updatedAt}
                        author={`${testimony.user.firstName} ${testimony.user.lastName}`}
                        status={testimony.status}
                        edit
                        onDelete={handleDelete}
                      />
                    </div>
                  ))
                )}
              </div>
            </TabPanel>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
            {testimonies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 col-span-3 bg-white rounded-md border">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FontAwesomeIcon icon={faPen} />
                </div>
                <p className="text-gray-500 font-medium">
                  No testimonies available
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  <Link
                    to={`/dashboard/testimonies/new`}
                    className="font-semibold underline"
                  >
                    Click here
                  </Link>{" "}
                  to create a new testimony.
                </p>
              </div>
            ) : (
              testimonies.map((testimony: Testimony) => (
                <div className="flex justify-center">
                  <TestimonyCard
                    key={testimony.id}
                    id={testimony.id}
                    thumbnail={testimony.thumbnail}
                    title={testimony.title}
                    body={truncateText(testimony.body, 15)}
                    edited={testimony.updatedAt}
                    author={`${testimony.user.firstName} ${testimony.user.lastName}`}
                    status={testimony.status}
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

export default MyTestimonies;
