import Section from "@/layouts/Section";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";

const CTA = () => {
  return (
    <Section className="py-10 bg-gray-200 px-2">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl text-[#747474] playfair-display-600 font-bold mb-8">
          Share Your Story
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl mb-8">
          Become part of a growing family of believers. Connect, share, and grow
          together as we encourage one another in faith and walk boldly with
          Christ every day.
        </p>
        <Link
          to="/signup"
          className="flex items-center font-semibold gap-3 px-4 py-2 rounded-md border border-[#3B3B1A] bg-[#3B3B1A] text-white w-fit"
        >
          Join Our Community <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
    </Section>
  );
};

export default CTA;
