import Section from "@/layouts/Section";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";

const CTA = () => {
  return (
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
  );
};

export default CTA;
