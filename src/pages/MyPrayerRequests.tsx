import { faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState, type ChangeEvent } from "react";
import PrayerRequestCard from "@/components/PrayerRequestCard";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
import type Post from "@/types/Post";
import { truncateText } from "@/utils/truncateText";

type PrayerRequest = Post<"prayerRequest">;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyPrayerRequests = () => {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    axios
      .get(
        `${BACKEND_URL}/api/v1/posts/search?q=${query}&type=prayerRequest&page=1&limit=9`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setPrayerRequests(response.data);
      });
  };
  useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/api/v1/posts/me?type=prayerRequest&body=true&page=1&limit=10`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setPrayerRequests(response.data);
      });
  }, []);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <div className=" lg:col-span-2">
        <div className="px-4 pt-6">
          <h1 className="text-3xl font-semibold text-stone-600 mb-1">
            My Prayer Requests
          </h1>
          <p className="text-gray-500">Manage your prayer requests</p>
        </div>
        <Separator className="my-6" />
        <div className="flex gap-4 items-center bg-white border rounded-md">
          <FontAwesomeIcon icon={faSearch} className="pl-4 text-gray-500" />
          <input
            type="text"
            className="w-full pr-4 py-2"
            placeholder="Search prayer requests..."
            onChange={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-6">
          {prayerRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 col-span-3 bg-white rounded-md border">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <p className="text-gray-500 font-medium">
                No prayer requests here
              </p>
              <p className="text-gray-400 text-sm mt-1">
                <Link
                  to={`/dashboard/prayer`}
                  className="font-semibold underline"
                >
                  Click here
                </Link>{" "}
                to submit a prayer request.
              </p>
            </div>
          ) : (
            prayerRequests.map((prayerRequest: PrayerRequest) => (
              <div className="flex justify-center">
                <PrayerRequestCard
                  key={prayerRequest.id}
                  id={prayerRequest.id}
                  subject={prayerRequest.title}
                  body={truncateText(prayerRequest.body || "", 15)}
                  updatedAt={prayerRequest.updatedAt}
                  author={`${prayerRequest.author.firstName} ${prayerRequest.author.lastName}`}
                  isAnswered={prayerRequest.meta.isAnswered}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPrayerRequests;
