import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { useAuth } from "@/context/useAuth";
import AuthNavigation from "@/components/AuthNavigation";
import SafeArea from "./SafeArea";

const UniversalLayout = () => {
  const { user } = useAuth();
  const loggedIn = user !== null;
  return (
    <>
      <div>
        {loggedIn ? <AuthNavigation /> : <Navigation />}
        <SafeArea>
          <main>
            <Outlet />
          </main>
        </SafeArea>
        <Footer />
      </div>
    </>
  );
};

export default UniversalLayout;
