import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useAuth } from "@/context/useAuth";
import { useEffect, useState, type ChangeEvent } from "react";
import PrayerRequestCard from "@/components/PrayerRequestCard";

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

type PrayerRequest = {
  id: string;
  subject: string;
  body: string;
  updatedAt: Date;
  requester: User;
  isAnswered: boolean;
  // add other properties if needed
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyPrayerRequests = () => {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const { user } = useAuth();
  console.log(user);
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleRemove = (prayerRequestId: string) => {
    axios
      .delete(`${BACKEND_URL}/api/v1/prayers/${prayerRequestId}`, {
        withCredentials: true,
      })
      .then(() => {
        setPrayerRequests((prev) =>
          prev.filter(
            (prayerRequest: PrayerRequest) =>
              prayerRequest.id !== prayerRequestId
          )
        );
      });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    axios
      .get(`${BACKEND_URL}/api/v1/prayers/search?q=${query}&page=1&limit=9`, {
        withCredentials: true,
      })
      .then((response) => {
        setPrayerRequests(response.data);
      });
  };
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/prayers/me?page=1&limit=10`, {
        withCredentials: true,
      })
      .then((response) => {
        setPrayerRequests(response.data);
      });
  }, [user?.id]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <div className=" lg:col-span-2">
        <div className="flex gap-4 items-center bg-white border rounded-md">
          <FontAwesomeIcon icon={faSearch} className="pl-4 text-gray-500" />
          <input
            type="text"
            className="w-full pr-4 py-2"
            placeholder="Search prayer requests..."
            onChange={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {prayerRequests.length === 0 ? (
            <p className="text-gray-500 px-4 w-full">No Prayer Requests</p>
          ) : (
            prayerRequests.map((prayerRequest: PrayerRequest) => (
              <div className="flex justify-center">
                <PrayerRequestCard
                  key={prayerRequest.id}
                  id={prayerRequest.id}
                  subject={prayerRequest.subject}
                  body={truncateText(prayerRequest.body, 15)}
                  edited={prayerRequest.updatedAt}
                  author={`${prayerRequest.requester.firstName} ${prayerRequest.requester.lastName}`}
                  isAnswered={prayerRequest.isAnswered}
                  edit
                  onDelete={handleRemove}
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
