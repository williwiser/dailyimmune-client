import Section from "@/layouts/Section";
import { Link } from "react-router";

const BeInspired = () => {
  return (
    <>
      <Section className="relative md:px-10">
        <div className=" flex flex-col lg:flex-row-reverse items-center justify-between gap-12">
          <article className="flex-1 px-8 py-12">
            <h1 className="text-5xl text-[#747474] playfair-display-600 font-bold mb-8">
              Be Inspired By God's Word
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mb-8">
              Receive daily devotionals filled with scripture, encouragement,
              and truth. Each message is designed to uplift your spirit, draw
              you closer to God, and help you navigate everyday life with
              renewed hope.
            </p>
            <Link
              to="/devotionals"
              className="flex items-center gap-3 px-4 py-3 font-semibold rounded-md bg-[#585841] text-white w-fit"
            >
              Explore Devotionals
            </Link>
          </article>
          <div className="overflow-hidden flex-1">
            <img src="backdrop7.webp" />
          </div>
        </div>
      </Section>
    </>
  );
};

export default BeInspired;
