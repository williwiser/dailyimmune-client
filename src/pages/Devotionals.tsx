import Header from "@/layouts/Header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Section from "@/layouts/Section";
import axios from "axios";
import DevotionalCard from "@/components/DevotionalCard";
import { Link } from "react-router";
import { slugify } from "@/utils/slugify";
import type Devotional from "@/types/Devotional";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";
import Container from "@/layouts/Container";

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;

  return words.slice(0, wordLimit).join(" ") + "...";
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Devotionals = () => {
  const [allDevotionals, setAllDevotionals] = useState<Devotional[]>([]);
  const [featuredDevotional, setFeaturedDevotional] = useState<Devotional>();
  const [recentDevotionals, setRecentDevotionals] = useState<Devotional[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreDevotionals, setHasMoreDevotionals] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const loadDevotionals = async (page: number = 1, append: boolean = false) => {
    try {
      setIsLoading(!append);
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/devotionals?page=${page}&limit=24`,
        { withCredentials: true }
      );

      const devotionals = response.data;
      console.log("devotionals", devotionals);
      if (page === 1) {
        setAllDevotionals(devotionals);

        // Set featured testimony (most recent)
        if (devotionals.length > 0) {
          setFeaturedDevotional(devotionals[0]);
          setRecentDevotionals(devotionals.slice(1));
        }
      } else {
        setAllDevotionals((prev) => [...prev, ...devotionals]);
        setRecentDevotionals((prev) => [...prev, ...devotionals]);
      }

      setHasMoreDevotionals(devotionals.length === 24);
    } catch (error) {
      console.error("Error fetching testimonies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadDevotionals(nextPage, true);
  };

  useEffect(() => {
    loadDevotionals();
  }, []);

  const EmptyState = () => (
    <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">
          No Devotionals Yet
        </h3>
        <p className="text-gray-500">
          Devotionals will be shared by administrators.
        </p>
      </div>
    </div>
  );

  const FeaturedDevotional = ({ devotional }: { devotional: Devotional }) => (
    <Section>
      <div className="rounded-2xl flex flex-col md:flex-row gap-6 items-centers overflow-hidden mb-12 px-4 lg:px-8 w-full">
        <div className="max-w-xl min-h-32">
          <img
            src={
              devotional.thumbnail ? devotional.thumbnail : "/placeholder.jpg"
            }
            className="object-cover rounded-md"
          />
        </div>
        <div className="relative w-full">
          <div className="relative z-10 md:px-8 lg:px-12 ">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col py-8 mb-6">
                <div className="inline-flex items-center w-fit px-3 py-1 gap-2 rounded-full bg-stone-500 bg-opacity-20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                  <FontAwesomeIcon icon={faStar} /> <span>Featured Story</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  {devotional.title}
                </h2>
                <p className="flex-1 text-xl text-gray-500 leading-relaxed mb-6 max-w-3xl">
                  {truncateText(devotional.body, 50)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-2 text-gray-500">
                  <Avatar className="size-10 border">
                    <AvatarImage
                      src={devotional.author.profilePhoto}
                    ></AvatarImage>
                    <AvatarFallback>
                      {devotional.author.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {devotional.author.firstName} {devotional.author.lastName}
                    </p>
                    <p className="text-sm opacity-75">
                      {new Date(devotional.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/devotionals/${devotional.id}/${slugify(
                    devotional.title
                  )}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <span>Read Full Story</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );

  return (
    <>
      <Header
        title="Devotionals"
        desc="Find strength and inspiration for your faith journey through scripture and reflections."
        className="bg-stone-100"
      />
      {featuredDevotional && (
        <FeaturedDevotional devotional={featuredDevotional} />
      )}
      <Container noVerticalPadding>
        <hr />
      </Container>
      <Section className="px-4 md:px-8 py-8 bg-white">
        {isLoading && allDevotionals.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <PulseLoader color="#79716b" />
          </div>
        ) : allDevotionals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8 flex justify-center items-center w-full px-4 md:px-8">
            {/* Recent Devotionals Section */}
            <div className="flex flex-col justify-center items-center w-full">
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  Recent Devotionals
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover more inspiring testimonies from our community members
                </p>
              </div>

              <div className="flex flex-col items-center md:grid gap-6 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 w-full">
                {recentDevotionals.map((devotional: Devotional) => (
                  <DevotionalCard
                    key={devotional.id}
                    id={devotional.id}
                    thumbnail={devotional.thumbnail}
                    title={devotional.title}
                    body={truncateText(devotional.body, 15)}
                    edited={devotional.updatedAt}
                    author={`${devotional.author.firstName} ${devotional.author.lastName}`}
                    status={devotional.status}
                  />
                ))}
              </div>
              {/* Load More Button */}
              {hasMoreDevotionals && (
                <div className="text-center pt-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <PulseLoader
                          color="#ffffff"
                          size={8}
                          className="mr-2"
                        />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Stories
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Section>
    </>
  );
};

export default Devotionals;
