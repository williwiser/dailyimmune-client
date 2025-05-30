import Container from "@/layouts/Container";
import Section from "@/layouts/Section";
import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faComment,
  faHandsPraying,
  faHeart,
  faShoppingBag,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import CommunityCard from "@/components/CommunityCard";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import { ArrowRight, BookOpen, Calendar, Heart, User } from "lucide-react";

interface Testimony {
  id: number;
  title: string;
  author: string;
  date: string;
  preview: string;
  readTime: string;
  category: string;
  image: string;
}

interface DailyEncouragement {
  id: number;
  title: string;
  verse: string;
  reference: string;
  date: string;
  preview: string;
  readTime: string;
  theme: string;
  image: string;
}

const Home = () => {
  const communityFeatures = [
    {
      icon: faComment,
      title: "Share Testimonies",
      desc: "Share your faith journey and how God has worked in your life.",
    },
    {
      icon: faHeart,
      title: "Daily Encouragement",
      desc: "Receive uplifting messages and scripture to strengthen your faith.",
    },
    {
      icon: faUserGroup,
      title: "Community Interaction",
      desc: "Connect with other believers through discussions and prayer requests.",
    },
    {
      icon: faComment,
      title: "Counselling",
      desc: "Get spiritual guidance and answers to your faith questions.",
    },
    {
      icon: faShoppingBag,
      title: "Christian Merchandise",
      desc: "Shop for faith-inspired products that reflect your beliefs.",
    },
    {
      icon: faHandsPraying,
      title: "Prayer Support",
      desc: "Submit prayer requests and pray for others in the community.",
    },
  ];

  const testimonies: Testimony[] = [
    {
      id: 1,
      title: "From Darkness to Light: My Journey of Healing",
      author: "Sarah Johnson",
      date: "May 15, 2025",
      preview:
        "After losing my job and facing the darkest period of my life, I discovered how God's grace carried me through. What seemed like the end became a beautiful new beginning...",
      readTime: "5 min read",
      category: "Healing",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      title: "Restored Marriage: A Miracle of Forgiveness",
      author: "Michael & Lisa Chen",
      date: "May 12, 2025",
      preview:
        "Our marriage was on the brink of divorce. Through prayer, counseling, and God's incredible mercy, we discovered a love deeper than we ever imagined possible...",
      readTime: "7 min read",
      category: "Marriage",
      image:
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
    },
    {
      id: 3,
      title: "Finding Purpose After Loss",
      author: "David Rodriguez",
      date: "May 8, 2025",
      preview:
        "When I lost my father, I questioned everything. Through this testimony, I want to share how God used my grief to birth a ministry that's now touching hundreds of lives...",
      readTime: "6 min read",
      category: "Purpose",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    },
    {
      id: 4,
      title: "Overcoming Addiction: God's Power to Transform",
      author: "Rebecca Martinez",
      date: "May 5, 2025",
      preview:
        "For years, addiction controlled my life. Today, I celebrate 2 years of freedom through Christ. This is my story of redemption and the hope that's available to everyone...",
      readTime: "8 min read",
      category: "Freedom",
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=250&fit=crop",
    },
  ];

  const encouragements: DailyEncouragement[] = [
    {
      id: 1,
      title: "Finding Strength in Weakness",
      verse:
        "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.'",
      reference: "2 Corinthians 12:9",
      date: "May 29, 2025",
      preview:
        "When we feel overwhelmed and inadequate, God's grace becomes our strength. Today's reflection explores how our vulnerabilities become doorways for God's power...",
      readTime: "3 min read",
      theme: "Grace",
      image:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      title: "Walking by Faith, Not by Sight",
      verse: "For we walk by faith, not by sight.",
      reference: "2 Corinthians 5:7",
      date: "May 28, 2025",
      preview:
        "In uncertain times, God calls us to trust His unseen hand. This devotion reminds us that faith sees what eyes cannot, and hope anchors what hearts need most...",
      readTime: "4 min read",
      theme: "Faith",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    },
    {
      id: 3,
      title: "Perfect Peace in God's Presence",
      verse:
        "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
      reference: "Isaiah 26:3",
      date: "May 27, 2025",
      preview:
        "Anxiety and worry lose their grip when we fix our minds on God. Discover how to cultivate the steadfast mind that leads to His perfect peace...",
      readTime: "3 min read",
      theme: "Peace",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    },
    {
      id: 4,
      title: "Never Alone in the Valley",
      verse:
        "Even though I walk through the darkest valley, I will fear no evil, for you are with me.",
      reference: "Psalm 23:4",
      date: "May 26, 2025",
      preview:
        "When life's valleys seem endless and dark, remember that God walks beside you. This powerful reminder shows us that His presence transforms every shadow...",
      readTime: "4 min read",
      theme: "Comfort",
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=250&fit=crop",
    },
  ];
  const handleReadMore = (id: number) => {
    // In a real app, this would navigate to the full testimony post
    console.log(`Navigate to testimony ${id}`);
  };

  return (
    <>
      <header className=" h-[100dvh] max-h-[750px] overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <Container noVerticalPadding>
          <div className="flex justify-center items-center md:justify-between h-full">
            <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
              <h1 className="text-6xl text-[#747474] font-bold max-w-2xl playfair-display-600 text-balance">
                Fuel Your Faith One Day at a Time
              </h1>
              <p className="text-lg text-stone-500">
                Faith-based content every day to renew your mind and grow
                spiritually.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 text-lg">
                <Link
                  to="/signup"
                  className="flex items-center gap-3 px-4 py-2 font-semibold rounded-md border border-[#3B3B1A] bg-[#3B3B1A] text-white"
                >
                  Join Our Community <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                <Link
                  to="/about"
                  className="inline-block px-4 py-2 rounded-md border border-white bg-stone-100 text-gray-500"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block max-w-xl overflow-y-hidden h-full">
              <img
                src="school_girl5.png"
                className="relative top-16 size-full object-contain"
                alt="daily immune"
              />
            </div>
          </div>
        </Container>
      </header>

      <Section
        title="Our Community Features"
        desc="Everything you need to grow in your faith and connect with fellow believers."
        className="py-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {communityFeatures.map((feature) => (
            <CommunityCard
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
            />
          ))}
        </div>
      </Section>
      <Section
        title="Recent Testimonies"
        desc="Read powerful stories of how God is transforming lives in our community."
        className="py-10 bg-gradient-to-br from-stone-50 to-stone-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured Testimony */}
          <div className="mb-12">
            <div className="bg-white rounded-md  overflow-hidden border border-gray-100">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={testimonies[0].image}
                    alt={testimonies[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-12">
                  <div className="flex items-center mb-4">
                    <span className="bg-stone-100 text-stone-800 px-3 py-1 rounded-full text-sm font-medium">
                      {testimonies[0].category}
                    </span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-500 text-sm">
                      {testimonies[0].readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {testimonies[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {testimonies[0].preview}
                  </p>
                  <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <User className="w-4 h-4 mr-2" />
                      <span className="mr-4">{testimonies[0].author}</span>
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{testimonies[0].date}</span>
                    </div>
                    <button
                      onClick={() => handleReadMore(testimonies[0].id)}
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

          {/* Other Testimonies Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonies.slice(1).map((testimony) => (
              <article
                key={testimony.id}
                className="bg-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 h-full"
              >
                <div className="relative">
                  <img
                    src={testimony.image}
                    alt={testimony.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {testimony.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 h-full">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {testimony.title}
                  </h3>

                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {testimony.preview}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{testimony.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{testimony.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#3B3B1A] text-sm font-medium">
                      {testimony.readTime}
                    </span>
                    <button
                      onClick={() => handleReadMore(testimony.id)}
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
            <button className="bg-white text-gray-500 border px-8 py-3 rounded-md font-semibold hover:bg-[#3B3B1A] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl">
              View All Testimonies
            </button>
          </div>
        </div>
      </Section>

      <Section
        title="Daily Encouragement"
        desc="Uplifting messages to strengthen your faith journey."
        className="py-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Today's Featured Encouragement */}
          <div className="mb-12">
            <div className="bg-white rounded-md overflow-hidden border border-gray-100">
              <div className="md:flex">
                <div className="md:w-2/5">
                  <img
                    src={encouragements[0].image}
                    alt={encouragements[0].title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-3/5 p-8 md:p-12">
                  <div className="flex items-center mb-4">
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                      Today's Word
                    </span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {encouragements[0].theme}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {encouragements[0].title}
                  </h3>

                  <blockquote className="border-l-4 border-amber-400 pl-4 mb-6">
                    <p className="text-lg text-gray-700 italic mb-2">
                      "{encouragements[0].verse}"
                    </p>
                    <cite className="text-amber-600 font-semibold">
                      {encouragements[0].reference}
                    </cite>
                  </blockquote>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {encouragements[0].preview}
                  </p>

                  <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="mr-4">{encouragements[0].date}</span>
                      <BookOpen className="w-4 h-4 mr-2" />
                      <span>{encouragements[0].readTime}</span>
                    </div>
                    <button
                      onClick={() => handleReadMore(encouragements[0].id)}
                      className="inline-flex w-full md:w-fit justify-center items-center bg-[#3B3B1A] text-white px-6 py-3 rounded-md font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Read Full Devotion
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Days Grid */}
          <div className="mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {encouragements.slice(1).map((encouragement) => (
                <article
                  key={encouragement.id}
                  className="bg-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  <div className="relative">
                    <img
                      src={encouragement.image}
                      alt={encouragement.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {encouragement.theme}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 h-full">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">
                      {encouragement.title}
                    </h4>

                    <blockquote className="border-l-3 border-amber-300 pl-3 mb-4">
                      <p className="text-sm text-gray-700 italic mb-1">
                        "
                        {encouragement.verse.length > 80
                          ? encouragement.verse.substring(0, 80) + "..."
                          : encouragement.verse}
                        "
                      </p>
                      <cite className="text-amber-600 text-sm font-medium">
                        {encouragement.reference}
                      </cite>
                    </blockquote>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {encouragement.preview.length > 100
                        ? encouragement.preview.substring(0, 100) + "..."
                        : encouragement.preview}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{encouragement.date}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        <span>{encouragement.readTime}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReadMore(encouragement.id)}
                      className="inline-flex items-center text-[#3B3B1A] hover:text-amber-700 font-semibold text-sm transition-colors duration-200 w-full justify-center py-2 border rounded-md hover:bg-amber-50"
                    >
                      Read Devotion
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Subscription CTA */}
          <div className="bg-gradient-to-r from-stone-400 to-stone-500 rounded-md p-8 md:p-12 text-center text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Never Miss Your Daily Encouragement
            </h3>
            <p className="text-white mb-6 max-w-2xl mx-auto">
              Subscribe to receive God's Word delivered to your inbox every
              morning. Start each day with hope, strength, and divine
              inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-md text-gray-800 border bg-stone-50 focus:ring-4 focus:ring-white/30 outline-none"
              />
              <button className="bg-white text-[#747474] px-6 py-3 rounded-md font-semibold hover:bg-amber-50 transition-colors duration-300 whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </Section>
      <Section
        title="Join Our Community"
        desc="Receive livestream and event updates."
        className="py-10 bg-gray-200"
      >
        <div className="flex justify-center">
          <Link
            to="/signup"
            className="flex items-center font-semibold gap-3 px-4 py-2 rounded-md border border-[#3B3B1A] bg-[#3B3B1A] text-white"
          >
            Join Our Community <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </Section>
      <FloatingChatWidget />
    </>
  );
};

export default Home;
