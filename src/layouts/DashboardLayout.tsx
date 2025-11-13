import SafeArea from "./SafeArea";
import AuthNavigation from "@/components/AuthNavigation";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { Navigate, Outlet } from "react-router";
import Container from "./Container";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import { useAuth } from "@/context/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  return loading ? (
    <main className="flex h-screen justify-center items-center">
      <PulseLoader color="#79716b" />
    </main>
  ) : user ? (
    <div className="w-full bg-stone-100">
      <AuthNavigation />
      <Container className="md:px-8">
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
  ) : (
    <Navigate to="/" />
  );
};

export default DashboardLayout;
