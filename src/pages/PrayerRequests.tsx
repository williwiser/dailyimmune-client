import PrayerRequestCard from "@/components/PrayerRequestCard";
import Header from "@/layouts/Header";
import Section from "@/layouts/Section";
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
        </Section>
      )}
    </>
  );
};

export default PrayerRequests;
