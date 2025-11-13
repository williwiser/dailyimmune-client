import Section from "@/layouts/Section";
import { Link } from "react-router";

const ShareYourStory = () => {
  return (
    <Section className="py-10 bg-gradient-to-br from-stone-50 to-stone-100 px-8">
      <div className="flex flex-col lg:flex-row justify-between gap-8 pl-4">
        <article>
          <h1 className="text-5xl text-[#747474] playfair-display-600 font-bold mb-8">
            Share Your Story
          </h1>
          <p className="text-lg text-gray-400 max-w-3xl mb-8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
            adipisci magnam ullam quia praesentium. Dolore, distinctio aliquam,
            quasi odio provident cupiditate, excepturi vitae ut quia aut sunt
            modi? Rem, quibusdam.
          </p>
          <Link
            to="/testimonies"
            className="flex items-center gap-3 px-4 py-3 font-semibold rounded-md  bg-[#585841] text-white w-fit"
          >
            Explore Testimonies
          </Link>
        </article>
        <div className="max-w-xl h-80 overflow-hidden rounded-md">
          <img src="backdrop11.jpg" />
        </div>
      </div>
    </Section>
  );
};

export default ShareYourStory;
