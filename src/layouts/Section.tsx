import type { ReactNode } from "react";
import Container from "./Container";

interface SectionProps {
  title?: string;
  desc?: string;
  children?: ReactNode;
  className?: string;
}

const Section = ({ title, desc, children, className }: SectionProps) => {
  return (
    <section className={`${className}`}>
      <Container>
        <div className="text-center mb-10">
          <h1 className="text-5xl text-[#747474] playfair-display-600 font-bold mb-3">
            {title}
          </h1>
          <p className="text-lg text-gray-500">{desc}</p>
        </div>
        {children}
      </Container>
    </section>
  );
};

export default Section;
