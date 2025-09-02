import SafeArea from "./SafeArea";
import AuthNavigation from "@/components/AuthNavigation";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router";
import Container from "./Container";
import FloatingChatWidget from "@/components/FloatingChatWidget";

const DashboardLayout = () => {
  return (
    <div className="w-full bg-stone-100">
      <AuthNavigation />
      <Container>
        <SafeArea className="flex flex-col md:flex-row gap-6 my-6">
          <Sidebar />
          <main className="w-full">
            <Outlet />
          </main>
        </SafeArea>
      </Container>
      <Footer />
      <FloatingChatWidget />
    </div>
  );
};

export default DashboardLayout;
