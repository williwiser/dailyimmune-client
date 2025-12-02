import Section from "@/layouts/Section";
import { Link } from "react-router";

const ShareYourStory = () => {
  return (
    <>
      <Section className="relative bg-stone-100 md:px-10">
        <div className=" flex flex-col lg:flex-row items-center justify-around gap-12">
          <article className="flex-1 px-8 md:py-12 md:px-0">
            <h1 className="text-5xl text-[#747474] playfair-display-600 font-bold mb-8">
              Let's Grow Together
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl mb-8">
              Open your heart and share the testimony of what God has done in
              your life. Your story can encourage others, strengthen faith, and
              remind someone that God is still moving today.
            </p>
            <Link
              to="/testimonies"
              className="flex items-center gap-3 px-4 py-3 font-semibold rounded-md bg-[#585841] text-white w-fit"
            >
              Explore Testimonies
            </Link>
          </article>

          <div className="overflow-hidden flex-1">
            <img src="backdrop11.webp" />
          </div>
        </div>
      </Section>
    </>
  );
};

export default ShareYourStory;
