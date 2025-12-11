import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { useAuth } from "@/context/useAuth";
import AuthNavigation from "@/components/AuthNavigation";
import SafeArea from "./SafeArea";
import PulseLoader from "react-spinners/PulseLoader";

const UniversalLayout = () => {
  const { user, loading } = useAuth();
  return (
    <>
      <div>
        {loading ? (
          <main className="flex h-screen justify-center items-center">
            <PulseLoader color="#79716b" />
          </main>
        ) : user ? (
          <>
            <AuthNavigation />
            <SafeArea>
              <main>
                <Outlet />
              </main>
            </SafeArea>
            <Footer />
          </>
        ) : (
          <>
            <Navigation />
            <SafeArea>
              <main>
                <Outlet />
              </main>
            </SafeArea>
            <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default UniversalLayout;
