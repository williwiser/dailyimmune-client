import { useEffect } from "react";
import { useLocation, Outlet } from "react-router";

const ScrollToTopLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // or "auto"
  }, [location.pathname]);

  return <Outlet />;
};

export default ScrollToTopLayout;
