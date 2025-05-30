import type { ReactNode } from "react";

interface ContainerProps {
  noVerticalPadding?: boolean;
  children?: ReactNode;
}

const Container = ({ noVerticalPadding, children }: ContainerProps) => {
  return (
    <div
      className={`container mx-auto max-w-6xl h-full px-4 ${
        noVerticalPadding ? "" : "py-4"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
