import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Testimonies from "./pages/Testimonies";
import Encouragement from "./pages/Devotionals";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Prayer from "./pages/Prayer";
import Forum from "./pages/Forum";
import { StreamTheme } from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
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
import { Events } from "./pages/Events";
import ManageProfile from "./pages/ManageProfile";
import SocketTest from "./pages/SocketTest";
import { SocketProvider } from "./context/SocketProvider";
import MySavedTestimonies from "./pages/MySavedTestimonies";
import EventInfo from "./pages/EventInfo";
import LiveStream from "./pages/LiveStream";
import WatchStream from "./pages/WatchStream";
import DevotionalEditor from "./pages/DevotionalEditor";
import MyDevotionals from "./pages/MyDevotionals";
import DevotionalArticle from "./pages/DevotionalArticle";
import Devotionals from "./pages/Devotionals";

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
          {
            path: "/devotionals",
            element: <Devotionals />,
          },
          {
            path: "/shop",
            element: <Shop />,
          },
          { path: "testimonies/:id/:slug", element: <Article /> },
          { path: "devotionals/:id/:slug", element: <DevotionalArticle /> },
          { path: "prayers", element: <PrayerRequests /> },
          { path: "profile/:id", element: <Profile /> },
        ],
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "testimonies/me", element: <MyTestimonies /> },
          { path: "testimonies/saved", element: <MySavedTestimonies /> },
          { path: "prayer-requests/me", element: <MyPrayerRequests /> },
          { path: "events/me", element: <Events /> },
          { path: "devotionals/me", element: <MyDevotionals /> },
          { path: "socket", element: <SocketTest /> },
        ],
      },
      {
        path: "dashboard",
        element: <LoggedInLayout />,
        children: [
          { path: "testimonies", element: <Testimonies /> },
          { path: "testimonies/new", element: <ArticleEditor /> },
          { path: "testimonies/:id/edit", element: <ArticleEditor /> },
          { path: "devotionals/new", element: <DevotionalEditor /> },
          { path: "devotionals/:id/edit", element: <DevotionalEditor /> },
          { path: "prayer", element: <SubmitPrayerRequest /> },
          { path: "profile/me", element: <ManageProfile /> },
        ],
      },
      {
        element: <LoggedInLayout />,
        children: [
          { path: "events/:id", element: <EventInfo /> },
          { path: "livestream/:id", element: <LiveStream /> },
          { path: "livestream/watch/:id", element: <WatchStream /> },
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
    <StreamTheme style={{ fontFamily: "sans-serif", color: "black" }}>
      <SocketProvider>
        <GoogleOAuthProvider clientId="10720018217-esrs5ojfien6rbceu9rvn210s6um0uvk.apps.googleusercontent.com">
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </GoogleOAuthProvider>
      </SocketProvider>
    </StreamTheme>
  );
};

export default App;
