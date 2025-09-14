import { type ReactNode } from "react";

interface SafeAreaProps {
  className?: string;
  children: ReactNode;
}

const SafeArea = ({ className, children }: SafeAreaProps) => {
  return <div className={`size-full pt-20 ${className}`}>{children}</div>;
};

export default SafeArea;
