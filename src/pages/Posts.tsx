import Header from "@/layouts/Header";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Section from "@/layouts/Section";
import axios from "axios";
import { Link } from "react-router";
import { slugify } from "@/utils/slugify";
import type Post from "@/types/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faStar } from "@fortawesome/free-solid-svg-icons";
import Container from "@/layouts/Container";
import PostCard from "@/components/PostCard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type PostPreview = Omit<Post<"article">, "body">;

const Posts = () => {
  const [allPosts, setAllPosts] = useState<PostPreview[]>([]);
  const [featuredPost, setFeaturedPost] = useState<PostPreview>();
  const [recentPosts, setRecentPosts] = useState<PostPreview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const loadPosts = async (page: number = 1, append: boolean = false) => {
    try {
      setIsLoading(!append);
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/posts?page=${page}&limit=24`,
        { withCredentials: true }
      );

      const posts = response.data;

      if (page === 1) {
        setAllPosts(posts);

        // Set featured testimony (most recent)
        if (posts.length > 0) {
          setFeaturedPost(posts[0]);
          setRecentPosts(posts.slice(1));
        }
      } else {
        setAllPosts((prev) => [...prev, ...posts]);
        setRecentPosts((prev) => [...prev, ...posts]);
      }

      setHasMorePosts(posts.length === 24);
    } catch (error) {
      console.error("Error fetching testimonies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadPosts(nextPage, true);
  };

  useEffect(() => {
    loadPosts();
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

  const FeaturedPost = ({ post }: { post: PostPreview }) => (
    <Section>
      <div className="rounded-2xl flex flex-col md:flex-row gap-6 items-centers overflow-hidden mb-12 px-4 lg:px-8 w-full">
        <div className="max-w-xl min-h-32">
          <img
            src={post.meta.thumbnail ? post.meta.thumbnail : "/placeholder.jpg"}
            className="object-cover rounded-md"
          />
        </div>
        <div className="relative w-full">
          <div className="relative z-10 md:px-8 lg:px-12 ">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col py-8 mb-6">
                <div className="inline-flex items-center w-fit px-3 py-1 gap-2 rounded-full bg-stone-500 bg-opacity-20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                  <FontAwesomeIcon icon={faStar} /> <span>Featured Post</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  {post.title}
                </h2>
                <p className="flex-1 text-xl text-gray-500 leading-relaxed mb-6 max-w-3xl">
                  {post.preview}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-2 text-gray-500">
                  <Avatar className="size-10 border">
                    <AvatarImage src={post.author.profilePhoto}></AvatarImage>
                    <AvatarFallback>{post.author.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {post.author.firstName} {post.author.lastName}
                    </p>
                    <p className="text-sm opacity-75">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/devotionals/${post.id}/${slugify(post.title)}`}
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
        title="Posts"
        desc="Find strength and inspiration for your faith journey through scripture and reflections."
        className="bg-stone-100"
      />
      {featuredPost && <FeaturedPost post={featuredPost} />}
      <Container noVerticalPadding>
        <hr />
      </Container>
      <Section className="px-4 md:px-8 py-8 bg-white">
        {isLoading && allPosts.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <PulseLoader color="#79716b" />
          </div>
        ) : allPosts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8 flex justify-center items-center w-full px-4 md:px-8">
            <div className="flex flex-col justify-center items-center w-full">
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  Recent Posts
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover more inspiring testimonies from our community members
                </p>
              </div>

              <div className="flex flex-col items-center md:grid gap-6 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 w-full">
                {recentPosts.map((post: PostPreview) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    thumbnail={post.meta.thumbnail}
                    title={post.title}
                    body={post.preview}
                    edited={post.updatedAt}
                    author={`${post.author.firstName} ${post.author.lastName}`}
                    status={post.status}
                  />
                ))}
              </div>
              {/* Load More Button */}
              {hasMorePosts && (
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
                        Load More Articles
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

export default Posts;
