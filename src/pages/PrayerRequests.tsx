import PrayerRequestCard from "@/components/PrayerRequestCard";
import Header from "@/layouts/Header";
import Section from "@/layouts/Section";
import { faPersonPraying } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface User {
  id: string;
  firstName: string;
  lastName: string;
}
interface PrayerRequest {
  id: string;
  subject: string;
  body: string;
  updatedAt: Date;
  requester: User;
  isAnswered: boolean;
  // add other properties if needed
}

const EmptyState = () => (
  <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
    <div className="max-w-md mx-auto">
      <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
        <FontAwesomeIcon
          icon={faPersonPraying}
          className="text-3xl text-gray-400"
        />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-3">
        No Prayer Requests Yet
      </h3>
      <p className="text-gray-500">
        Need prayer? Be the first to submit a prayer request.
      </p>
    </div>
  </div>
);

const PrayerRequests = () => {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;

    return words.slice(0, wordLimit).join(" ") + "...";
  };
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/prayers?page=1&limit=25`, {
        withCredentials: true,
      })
      .then((response) => {
        setPrayerRequests(response.data);
        console.log(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Header
        title="Prayer Requests"
        desc="Pray for members in the community"
        className="bg-stone-100"
      />
      {isLoading ? (
        <Section>
          <div className="flex justify-center items-center px-8">
            <PulseLoader color="#79716b" />
          </div>
        </Section>
      ) : (
        <Section>
          {prayerRequests.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 px-8">
              {prayerRequests.map((prayerRequest: PrayerRequest) => (
                <div
                  key={prayerRequest.id}
                  className="flex items-center justify-center"
                >
                  <PrayerRequestCard
                    key={prayerRequest.id}
                    id={prayerRequest.id}
                    subject={prayerRequest.subject}
                    author={`${prayerRequest.requester.firstName} ${prayerRequest.requester.lastName}`}
                    body={truncateText(prayerRequest.body, 15)}
                    updatedAt={prayerRequest.updatedAt}
                    isAnswered={prayerRequest.isAnswered}
                  />
                </div>
              ))}
            </div>
          )}
        </Section>
      )}
    </>
  );
};

export default PrayerRequests;
