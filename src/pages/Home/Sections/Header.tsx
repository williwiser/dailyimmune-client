import SlideIn from "@/components/SlideIn";
import Container from "@/layouts/Container";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";

const Header = () => {
  return (
    <header
      className=" h-[95dvh] max-h-[750px] overflow-hidden bg-gradient-to-b from-white to-gray-50 bg-top bg-cover"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.45)), url('/backdrop10.webp')",
      }}
    >
      <Container noVerticalPadding>
        <div className="flex justify-center items-center md:justify-center h-full w-full">
          <div className="flex flex-col items-center  gap-4 text-center md:text-left justify-center">
            <SlideIn direction="down" delay={0.5}>
              <h1 className="text-6xl md:text-7xl 2xl:text-7xl text-white ext-[#747474] font-bold max-w-2xl xl:max-w-4xl playfair-display-600 text-balance text-center">
                Fuel Your Faith One Day at a Time
              </h1>
            </SlideIn>
            <SlideIn direction="down" delay={0.7}>
              <p className="text-lg 2xl:text-xl text-white ext-stone-500 text-center">
                Faith-based content every day to renew your mind and grow
                spiritually.
              </p>
            </SlideIn>
            <SlideIn direction="down" delay={0.9}>
              <div className="flex flex-col sm:flex-row gap-2 text-xl items-center justify-center">
                <Link
                  to="/signup"
                  className="flex items-center gap-3 px-4 py-3 font-semibold rounded-md  bg-[#585841] text-white"
                >
                  Join Our Community <FontAwesomeIcon icon={faArrowRight} />
                </Link>
                <Link
                  to="/about"
                  className="inline-block px-4 py-3 rounded-md border border-white bg-stone-100 text-gray-500 w-full sm:w-fit"
                >
                  Learn More
                </Link>
              </div>
            </SlideIn>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
