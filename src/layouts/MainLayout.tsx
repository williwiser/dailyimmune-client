import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import { Navigate } from "react-router";
import { useAuth } from "@/context/useAuth";

const MainLayout = () => {
  const { user } = useAuth();
  const loggedIn = user !== null;
  return (
    <>
      {loggedIn ? (
        <Navigate to="/dashboard" />
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
