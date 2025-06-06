import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Testimonies from "./pages/Testimonies";
import Encouragement from "./pages/Encouragement";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Prayer from "./pages/Prayer";
import Forum from "./pages/Forum";
//import Dashboard from "./pages/Dashboard";
import VerifyToken from "./pages/VerifyToken";
import ActivationLink from "./pages/ActivationLink";
import AuthProvider from "./context/AuthProvider";
import Dash2 from "./pages/Dash2";
import DashboardLayout from "./layouts/DashboardLayout";
import CreateTestimony from "./pages/CreateTestimony";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/testimonies",
        element: <Testimonies />,
      },
      {
        path: "/encouragement",
        element: <Encouragement />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/prayer",
        element: <Prayer />,
      },
      {
        path: "/forum",
        element: <Forum />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dash2 /> },
      { path: "testimonies", element: <Testimonies /> },
      { path: "testimonies/new", element: <CreateTestimony /> },
    ],
  },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
  { path: "/verify-token", element: <VerifyToken /> },
  { path: "/activation-link", element: <ActivationLink /> },
]);

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
