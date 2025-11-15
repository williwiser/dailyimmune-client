import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CommunityCardProps {
  icon: IconDefinition;
  title?: string;
  desc?: string;
}

const CommunityCard = ({ icon, title, desc }: CommunityCardProps) => {
  return (
    <div className="bg-[#ebeee3]/50 p-6 rounded-md text-center flex flex-col items-center gap-3 border border-[#c8ccb9]">
      <FontAwesomeIcon
        className="bg-stone-200 p-3 rounded-full text-2xl w-fit"
        icon={icon}
      />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-600 max-w-sm text-pretty">{desc}</p>
    </div>
  );
};

export default CommunityCard;
