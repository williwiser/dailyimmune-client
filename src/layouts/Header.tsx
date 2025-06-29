import type { ReactNode } from "react";
import Section from "./Section";

interface HeaderProps {
  title?: string;
  desc?: string;
  className?: string;
  children?: ReactNode;
}

const Header = ({ title, desc, className, children }: HeaderProps) => {
  return (
    <Section title={title} desc={desc} className={`py-24 ${className}`}>
      {children}
    </Section>
  );
};

export default Header;
