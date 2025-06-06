import { type ReactNode } from "react";

interface SafeAreaProps {
  children: ReactNode;
}

const SafeArea = ({ children }: SafeAreaProps) => {
  return <div className="size-full pt-24">{children}</div>;
};

export default SafeArea;
