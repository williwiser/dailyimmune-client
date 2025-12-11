import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Encouragement from "./pages/Posts";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Prayer from "./pages/Prayer";
import Forum from "./pages/Forum";
import { StreamTheme } from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
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
import MyPrayerRequests from "./pages/MyPrayerRequests";
import { Events } from "./pages/Events";
import ManageProfile from "./pages/ManageProfile";
import SocketTest from "./pages/SocketTest";
import { SocketProvider } from "./context/SocketProvider";
import EventInfo from "./pages/EventInfo";
import LiveStream from "./pages/LiveStream";
import WatchStream from "./pages/WatchStream";
import Verification from "./pages/Verification";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MySavedPosts from "./pages/MySavedPosts";
import Feed from "./pages/Feed";
import Posts from "./pages/Posts";
import MyPosts from "./pages/MyPosts";

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
            path: "/posts",
            element: <Posts />,
          },
          {
            path: "/shop",
            element: <Shop />,
          },
          { path: "posts/:id/:slug", element: <Article /> },
          { path: "prayers", element: <PrayerRequests /> },
          { path: "profile/:id", element: <Profile /> },
          { path: "404", element: <NotFound /> },
        ],
      },
      {
        element: <DashboardLayout />,
        children: [
          { path: "/feed", element: <Feed /> },
          { path: "saved/me", element: <MySavedPosts /> },
          { path: "prayer-requests/me", element: <MyPrayerRequests /> },
          { path: "events/me", element: <Events /> },
          { path: "posts/me", element: <MyPosts /> },
          { path: "socket", element: <SocketTest /> },
        ],
      },
      {
        element: <LoggedInLayout />,
        children: [
          { path: "posts/new", element: <ArticleEditor /> },
          { path: "posts/:id/edit", element: <ArticleEditor /> },
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
      { path: "/verification", element: <Verification /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      {
        element: <UniversalLayout />,
        children: [{ path: "*", element: <NotFound /> }],
      },
    ],
  },
]);

const App = () => {
  const queryClient = new QueryClient();

  return (
    <StreamTheme style={{ fontFamily: "sans-serif", color: "black" }}>
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId="10720018217-esrs5ojfien6rbceu9rvn210s6um0uvk.apps.googleusercontent.com">
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </SocketProvider>
    </StreamTheme>
  );
};

export default App;
