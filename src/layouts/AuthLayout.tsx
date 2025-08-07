import type { ReactNode } from "react";
import { Link } from "react-router";

interface AuthLayoutProps {
  title: string;
  children?: ReactNode;
}

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <main className="flex justify-center items-center h-screen bg-white md:bg-stone-200 p-2">
      <div className="flex flex-col justify-center p-6 gap-3 rounded-md bg-white w-full max-w-sm border">
        <Link to="/">
          <img src="logo_trimmed.webp" className="w-[8rem]" />
        </Link>
        <h1 className="text-center text-[#747474] text-4xl font-bold">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
