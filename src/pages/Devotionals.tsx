import Header from "@/layouts/Header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Section from "@/layouts/Section";
import axios from "axios";
import Container from "@/layouts/Container";
import DevotionalCard from "@/components/DevotionalCard";
import { Link } from "react-router";
import { slugify } from "@/utils/slugify";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
};

type Devotional = {
  id: string;
  title: string;
  body: string;
  thumbnail: string;
  updatedAt: Date;
  author: User;
  status: string;
  // add other properties if needed
};

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;

  return words.slice(0, wordLimit).join(" ") + "...";
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Devotionals = () => {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [featuredDevotional, setFeaturedDevotional] = useState<Devotional>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BACKEND_URL}/api/v1/devotionals`)
      .then((response) => {
        setDevotionals(response.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setFeaturedDevotional(devotionals[0]);
  }, [devotionals]);

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
          Be the first to share your testimony and inspire others in our
          community.
        </p>
      </div>
    </div>
  );

  const FeaturedDevotional = ({ devotional }: { devotional: Devotional }) => (
    <div className="rounded-2xl flex flex-col md:flex-row gap-6 items-center justify-center overflow-hidden mb-12 ">
      <img
        src="/placeholder.jpg"
        className="size-96 object-cover rounded-2xl"
      />
      <div className="relative">
        <div className="relative z-10 px-8 lg:px-12 ">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-stone-500 bg-opacity-20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                Featured Devotional
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {devotional.title}
              </h2>
              <p className="text-xl text-gray-500 leading-relaxed mb-6 max-w-3xl">
                {truncateText(devotional.body, 50)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Avatar className="size-10 border">
                  <AvatarImage
                    src={devotional.author.profilePhoto}
                    className="object-cover"
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
                className="cursor-pointer inline-flex items-center px-6 py-3 bg-white text-stone-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Read Full Story
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header
        title="Devotionals"
        desc="Find strength and inspiration for your faith journey through scripture and reflections."
      />

      {featuredDevotional && (
        <Container>
          <FeaturedDevotional devotional={featuredDevotional} />
        </Container>
      )}
      <Section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && devotionals.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <PulseLoader color="#3b82f6" size={12} />
            </div>
          ) : devotionals.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {/* Recent Testimonies Section */}
              <div className="rounded-2xl">
                <div className="text-center mb-10">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    Recent Devotionals
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Discover more inspiring testimonies from our community
                    members
                  </p>
                </div>

                {/* Desktop View - Horizontal Scroll */}
                <div className="hidden lg:grid mb-6">
                  <div className="grid gap-3 grid-cols-3">
                    {devotionals.map((devotional: Devotional, index) => (
                      <div
                        key={devotional.id}
                        className="flex-shrink-0 w-80 transform transition-all duration-300 hover:scale-[1.02]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <DevotionalCard
                          id={devotional.id}
                          thumbnail={devotional.thumbnail}
                          title={devotional.title}
                          body={truncateText(devotional.body, 15)}
                          edited={devotional.updatedAt}
                          author={`${devotional.author.firstName} ${devotional.author.lastName}`}
                          status={devotional.status}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile/Tablet View - Grid Layout */}
                <div className="lg:hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {devotionals.map((devotional: Devotional, index) => (
                      <div
                        key={devotional.id}
                        className="transform transition-all duration-300 hover:scale-[1.02]"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <DevotionalCard
                          id={devotional.id}
                          thumbnail={devotional.thumbnail}
                          title={devotional.title}
                          body={truncateText(devotional.body, 15)}
                          edited={devotional.updatedAt}
                          author={`${devotional.author.firstName} ${devotional.author.lastName}`}
                          status={devotional.status}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-blue-600">
                      {devotionals.length}+
                    </div>
                    <div className="text-gray-600 font-medium">
                      Stories Shared
                    </div>
                    <div className="text-sm text-gray-500">
                      Lives transformed through faith
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-600">
                      {
                        new Set(
                          devotionals.map(
                            (t) => `${t.author.firstName} ${t.author.lastName}`
                          )
                        ).size
                      }
                      +
                    </div>
                    <div className="text-gray-600 font-medium">
                      Contributors
                    </div>
                    <div className="text-sm text-gray-500">
                      Community members sharing hope
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-purple-600">
                      {Math.ceil(devotionals.length / 30)}+
                    </div>
                    <div className="text-gray-600 font-medium">
                      Months Active
                    </div>
                    <div className="text-sm text-gray-500">
                      Building our testimony collection
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
};

export default Devotionals;
