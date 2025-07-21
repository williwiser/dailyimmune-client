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
import DashboardLayout from "./layouts/DashboardLayout";
import ArticleEditor from "./pages/ArticleEditor";
import Article from "./pages/Article";
import SubmitPrayerRequest from "./pages/SubmitPrayerRequest";
import Profile from "./pages/Profile";
import UniversalLayout from "./layouts/UniversalLayout";
import PrayerRequests from "./pages/PrayerRequests";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ScrollToTopLayout from "./components/ScrollToTopLayout";
import LoggedInLayout from "./layouts/LoggedInLayout";
import Dashboard from "./pages/Dash2";
import MyTestimonies from "./pages/MyTestimonies";
import MyPrayerRequests from "./pages/MyPrayerRequests";

const router = createBrowserRouter([
  {
    element: <ScrollToTopLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
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
        element: <UniversalLayout />,
        children: [
          {
            path: "/testimonies",
            element: <Testimonies />,
          },
          { path: "testimonies/:id", element: <Article /> },
          { path: "prayers", element: <PrayerRequests /> },
        ],
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "testimonies/me", element: <MyTestimonies /> },
          { path: "testimonies/saved", element: <MyTestimonies /> },
          { path: "prayer-requests/me", element: <MyPrayerRequests /> },
          { path: "events/me", element: <MyTestimonies /> },
        ],
      },
      {
        path: "dashboard",
        element: <LoggedInLayout />,
        children: [
          { path: "testimonies", element: <Testimonies /> },
          { path: "testimonies/new", element: <ArticleEditor /> },
          { path: "testimonies/:id/edit", element: <ArticleEditor /> },
          { path: "prayer", element: <SubmitPrayerRequest /> },
          { path: "profile", element: <Profile /> },
        ],
      },
      { path: "/signup", element: <SignUp /> },
      { path: "/login", element: <LogIn /> },
      { path: "/activate", element: <VerifyToken /> },
      { path: "/activation-link", element: <ActivationLink /> },
    ],
  },
]);

const App = () => {
  return (
    <GoogleOAuthProvider clientId="10720018217-esrs5ojfien6rbceu9rvn210s6um0uvk.apps.googleusercontent.com">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
