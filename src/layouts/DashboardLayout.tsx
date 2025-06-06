import SafeArea from "./SafeArea";
import AuthNavigation from "@/components/AuthNavigation";
import Footer from "@/components/Footer";
import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div className="w-full h-screen">
      <AuthNavigation />
      <SafeArea>
        <main className="w-full">
          <Outlet />
        </main>
        <Footer />
      </SafeArea>
    </div>
  );
};

export default DashboardLayout;
