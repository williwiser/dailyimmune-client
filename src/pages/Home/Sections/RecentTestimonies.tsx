import Section from "@/layouts/Section";
import type Testimony from "@/types/Testimony";
import { slugify } from "@/utils/slugify";
import { truncateText } from "@/utils/truncateText";
import axios from "axios";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RecentTestimonies = () => {
  const navigate = useNavigate();
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);

  const handleReadMore = (id: string, title: string) => {
    navigate(`/testimonies/${id}/${slugify(title)}`);
  };

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/testimonies/staff-picks?page=1&limit=4`)
      .then((response) => {
        setTestimonies(response.data);
      });
  }, []);

  return (
    <Section
      title="Recent Testimonies"
      desc="Read powerful stories of how God is transforming lives in our community."
      className="py-10 bg-gradient-to-br from-stone-50 to-stone-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Testimony */}
        {testimonies[0] && (
          <div className="mb-12">
            <div className="bg-white rounded-md  overflow-hidden border border-gray-100">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={
                      testimonies[0].thumbnail
                        ? testimonies[0].thumbnail
                        : "/placeholder.jpg"
                    }
                    alt={testimonies[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="flex flex-col md:w-1/2 p-8 md:p-12">
                  <div className="flex items-center mb-4">
                    <span className="bg-stone-100 text-stone-800 px-3 py-1 rounded-full text-sm font-medium">
                      Faith
                    </span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-500 text-sm">
                      {Math.ceil(testimonies[0].body.length / 200)} min read
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {testimonies[0].title}
                  </h3>
                  <p className="flex-1 text-gray-600 mb-6 leading-relaxed">
                    {truncateText(testimonies[0].body, 20)}
                  </p>
                  <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between">
                    <div className="flex flex-col text-gray-500 text-sm">
                      <div className="flex">
                        <User className="w-4 h-4 mr-2" />
                        <span className="mr-4">
                          {testimonies[0].user.firstName}{" "}
                          {testimonies[0].user.lastName}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleReadMore(testimonies[0].id, testimonies[0].title)
                      }
                      className="inline-flex w-full md:w-fit justify-center items-center bg-[#3B3B1A] text-white px-6 py-3 rounded-md font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Testimonies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonies.slice(1).map((testimony) => (
            <article
              key={testimony.id}
              className="bg-white rounded-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 h-full"
            >
              <div className="relative">
                <img
                  src={
                    testimony.thumbnail
                      ? testimony.thumbnail
                      : "/placeholder.jpg"
                  }
                  alt={testimony.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    Faith
                  </span>
                </div>
              </div>

              <div className="p-6 h-full">
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {testimony.title}
                </h3>

                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {truncateText(testimony.body, 20)}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>
                      {testimony.user.firstName} {testimony.user.lastName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {new Date(testimony.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#3B3B1A] text-sm font-medium">
                    {Math.ceil(testimony.body.length / 200)} min read
                  </span>
                  <button
                    onClick={() =>
                      handleReadMore(testimony.id, testimony.title)
                    }
                    className="inline-flex items-center text-[#3B3B1A] hover:text-blue-700 font-semibold text-sm transition-colors duration-200"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/testimonies"
            className="bg-white text-gray-500 border px-8 py-3 rounded-md font-semibold hover:bg-[#3B3B1A] hover:text-white transition-all duration-300 hover:shadow-xl"
          >
            More Testimonies
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default RecentTestimonies;
