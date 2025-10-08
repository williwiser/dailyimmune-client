import Section from "@/layouts/Section";
import type Devotional from "@/types/Devotional";
import { slugify } from "@/utils/slugify";
import { ArrowRight, BookOpen, Calendar, Heart } from "lucide-react";
import { useNavigate } from "react-router";

const encouragements: Omit<Devotional, "status" | "body" | "author">[] = [
  {
    id: "1",
    title: "Finding Strength in Weakness",
    verse:
      "But he said to me, 'My grace is sufficient for you, for my power is made perfect in weakness.'",
    reference: "2 Corinthians 12:9",
    updatedAt: new Date("May 29, 2025"),
    preview:
      "When we feel overwhelmed and inadequate, God's grace becomes our strength. Today's reflection explores how our vulnerabilities become doorways for God's power...",
    readTime: "3 min read",
    theme: "Grace",
    thumbnail:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=250&fit=crop",
  },
  {
    id: "2",
    title: "Walking by Faith, Not by Sight",
    verse: "For we walk by faith, not by sight.",
    reference: "2 Corinthians 5:7",
    updatedAt: new Date("May 28, 2025"),
    preview:
      "In uncertain times, God calls us to trust His unseen hand. This devotion reminds us that faith sees what eyes cannot, and hope anchors what hearts need most...",
    readTime: "4 min read",
    theme: "Faith",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
  },
  {
    id: "3",
    title: "Perfect Peace in God's Presence",
    verse:
      "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
    reference: "Isaiah 26:3",
    updatedAt: new Date("May 27, 2025"),
    preview:
      "Anxiety and worry lose their grip when we fix our minds on God. Discover how to cultivate the steadfast mind that leads to His perfect peace...",
    readTime: "3 min read",
    theme: "Peace",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
  },
  {
    id: "4",
    title: "Never Alone in the Valley",
    verse:
      "Even though I walk through the darkest valley, I will fear no evil, for you are with me.",
    reference: "Psalm 23:4",
    updatedAt: new Date("May 26, 2025"),
    preview:
      "When life's valleys seem endless and dark, remember that God walks beside you. This powerful reminder shows us that His presence transforms every shadow...",
    readTime: "4 min read",
    theme: "Comfort",
    thumbnail:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=250&fit=crop",
  },
];

const DailyEncouragement = () => {
  const navigate = useNavigate();
  const handleReadMore = (id: string, title: string) => {
    navigate(`/testimonies/${id}/${slugify(title)}`);
  };
  return (
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
                  src={encouragements[0].thumbnail}
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

                <blockquote className="border-l-4 border-stone-400 pl-4 mb-6">
                  <p className="text-lg text-gray-700 italic mb-2">
                    "{encouragements[0].verse}"
                  </p>
                  <cite className="text-stone-600 font-semibold">
                    {encouragements[0].reference}
                  </cite>
                </blockquote>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {encouragements[0].preview}
                </p>

                <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="mr-4">
                      {encouragements[0].updatedAt?.toLocaleDateString()}
                    </span>
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{encouragements[0].readTime}</span>
                  </div>
                  <button
                    onClick={() =>
                      handleReadMore(
                        encouragements[0].id!,
                        encouragements[0].title!
                      )
                    }
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
                className="bg-white rounded-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={encouragement.thumbnail}
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

                  <blockquote className="border-l-3 border-stone-300 pl-3 mb-4">
                    <p className="text-sm text-gray-700 italic mb-1">
                      "
                      {encouragement.verse.length > 80
                        ? encouragement.verse.substring(0, 80) + "..."
                        : encouragement.verse}
                      "
                    </p>
                    <cite className="text-stone-600 text-sm font-medium">
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
                      <span>
                        {encouragement.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      <span>{encouragement.readTime}</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleReadMore(encouragement.id, encouragement.title)
                    }
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
            morning. Start each day with hope, strength, and divine inspiration.
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
  );
};

export default DailyEncouragement;
