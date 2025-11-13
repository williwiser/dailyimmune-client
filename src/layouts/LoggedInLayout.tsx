import SafeArea from "./SafeArea";
import AuthNavigation from "@/components/AuthNavigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/useAuth";
import { Navigate, Outlet } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";

const LoggedInLayout = () => {
  const { user, loading } = useAuth();
  return loading ? (
    <main className="flex h-screen justify-center items-center">
      <PulseLoader color="#79716b" />
    </main>
  ) : user ? (
    <div className="w-full">
      <AuthNavigation />
      <SafeArea>
        <main className="w-full">
          <Outlet />
        </main>
      </SafeArea>
      <Footer />
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default LoggedInLayout;
