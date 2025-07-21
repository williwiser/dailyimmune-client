import SafeArea from "./SafeArea";
import AuthNavigation from "@/components/AuthNavigation";
import Footer from "@/components/Footer";
import { Outlet } from "react-router";

const LoggedInLayout = () => {
  return (
    <div className="w-full">
      <AuthNavigation />
      <SafeArea>
        <main className="w-full">
          <Outlet />
        </main>
      </SafeArea>
      <Footer />
    </div>
  );
};

export default LoggedInLayout;
