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
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
