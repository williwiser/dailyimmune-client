import CommunityCard from "@/components/CommunityCard";
import communityFeatures from "@/data/features";
import Section from "@/layouts/Section";

const Features = () => {
  return (
    <Section
      title="Our Community Features"
      desc="Everything you need to grow in your faith and connect with fellow believers."
      className="py-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {communityFeatures.map((feature) => (
          <CommunityCard
            icon={feature.icon}
            title={feature.title}
            desc={feature.desc}
          />
        ))}
      </div>
    </Section>
  );
};

export default Features;
