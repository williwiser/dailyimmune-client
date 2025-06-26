import Section from "./Section";

interface HeaderProps {
  title?: string;
  desc?: string;
  className?: string;
}

const Header = ({ title, desc, className }: HeaderProps) => {
  return <Section title={title} desc={desc} className={`pt-24 ${className}`} />;
};

export default Header;
