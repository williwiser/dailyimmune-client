import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { Navigate } from "react-router";
import { useAuth } from "@/context/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const MainLayout = () => {
  const { user, loading } = useAuth();
  return (
    <>
      {loading ? (
        <main className="flex h-screen justify-center items-center">
          <PulseLoader color="#79716b" />
        </main>
      ) : user ? (
        <Navigate to="/feed" />
      ) : (
        <div>
          <Navigation />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

export default MainLayout;
