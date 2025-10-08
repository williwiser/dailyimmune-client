import type { ReactNode } from "react";

interface ContainerProps {
  noVerticalPadding?: boolean;
  children?: ReactNode;
  className?: string;
}

const Container = ({
  noVerticalPadding,
  children,
  className,
}: ContainerProps) => {
  return (
    <div
      className={`container mx-auto max-w-screen-2xl h-full px-4 ${
        noVerticalPadding ? "" : "py-4"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
