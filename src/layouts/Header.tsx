import Section from "./Section";

interface HeaderProps {
  title?: string;
  desc?: string;
}

const Header = ({ title, desc }: HeaderProps) => {
  return <Section title={title} desc={desc} className="pt-24" />;
};

export default Header;
