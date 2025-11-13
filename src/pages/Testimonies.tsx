import TestimonyCard from "@/components/TestimonyCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Container from "@/layouts/Container";
import Header from "@/layouts/Header";
import Section from "@/layouts/Section";
import { slugify } from "@/utils/slugify";
import { faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type User = {
  firstName: string;
  lastName: string;
  profilePhoto: string;
};

type Testimony = {
  id: string;
  title: string;
  preview: string;
  meta: {
    thumbnail?: string;
  };
  updatedAt: Date;
  authorId: string;
  author: User;
  status: string;
};

const Testimonies = () => {
  const [allTestimonies, setAllTestimonies] = useState<Testimony[]>([]);
  const [featuredTestimony, setFeaturedTestimony] = useState<Testimony | null>(
    null
  );
  const [recentTestimonies, setRecentTestimonies] = useState<Testimony[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreTestimonies, setHasMoreTestimonies] = useState(true);

  const loadTestimonies = async (page: number = 1, append: boolean = false) => {
    try {
      setIsLoading(!append);
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/posts?type=testimony&page=${page}&limit=24`,
        { withCredentials: true }
      );

      const testimonies = response.data;

      if (page === 1) {
        setAllTestimonies(testimonies);

        // Set featured testimony (most recent)
        if (testimonies.length > 0) {
          setFeaturedTestimony(testimonies[0]);
          setRecentTestimonies(testimonies.slice(1));
        }
      } else {
        setAllTestimonies((prev) => [...prev, ...testimonies]);
        setRecentTestimonies((prev) => [...prev, ...testimonies]);
      }

      setHasMoreTestimonies(testimonies.length === 24);
    } catch (error) {
      console.error("Error fetching testimonies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadTestimonies(nextPage, true);
  };

  useEffect(() => {
    loadTestimonies();
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
          No Testimonies Yet
        </h3>
        <p className="text-gray-500">
          Be the first to share your testimony and inspire others in our
          community.
        </p>
      </div>
    </div>
  );

  const FeaturedTestimony = ({ testimony }: { testimony: Testimony }) => (
    <Section>
      <div className="rounded-2xl flex flex-col md:flex-row gap-6 items-centers overflow-hidden mb-12 px-4 lg:px-8 w-full">
        <div className="max-w-xl min-h-32">
          <img
            src={
              testimony.meta.thumbnail
                ? testimony.meta.thumbnail
                : "/placeholder.jpg"
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
                  {testimony.title}
                </h2>
                <p className="flex-1 text-xl text-gray-500 leading-relaxed mb-6 max-w-3xl">
                  {testimony.preview}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-2 text-gray-500">
                  <Avatar className="size-10 border">
                    <AvatarImage
                      src={testimony.author.profilePhoto}
                    ></AvatarImage>
                    <AvatarFallback>
                      {testimony.author.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {testimony.author.firstName} {testimony.author.lastName}
                    </p>
                    <p className="text-sm opacity-75">
                      {new Date(testimony.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/testimonies/${testimony.id}/${slugify(
                    testimony.title
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
        title="Testimonies"
        desc="Read powerful stories of how God is transforming lives in our community."
        className="bg-stone-100"
      ></Header>

      {featuredTestimony && <FeaturedTestimony testimony={featuredTestimony} />}
      <Container noVerticalPadding>
        <hr />
      </Container>
      <Section className=" px-4 md:px-8 py-8 bg-white">
        {isLoading && allTestimonies.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <PulseLoader color="#79716b" />
          </div>
        ) : allTestimonies.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8 flex justify-center items-center w-full px-4 md:px-8">
            {/* Recent Testimonies Section */}
            <div className="flex flex-col justify-center items-center w-full">
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  Recent Stories
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover more inspiring testimonies from our community members
                </p>
              </div>

              {/* Desktop View - Horizontal Scroll */}
              <div className="flex flex-col items-center md:grid gap-6 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 w-full">
                {recentTestimonies.map((testimony: Testimony) => (
                  <TestimonyCard
                    key={testimony.id}
                    id={testimony.id}
                    thumbnail={testimony.meta.thumbnail}
                    title={testimony.title}
                    body={testimony.preview}
                    edited={testimony.updatedAt}
                    author={`${testimony.author.firstName} ${testimony.author.lastName}`}
                    status={testimony.status}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreTestimonies && (
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

export default Testimonies;
