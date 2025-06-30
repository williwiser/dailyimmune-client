import Section from "@/layouts/Section";
import PulseLoader from "react-spinners/PulseLoader";

const Loader = () => {
  return (
    <Section>
      <div className="flex justify-center items-center">
        <PulseLoader color="#747474" />
      </div>
    </Section>
  );
};

export default Loader;
