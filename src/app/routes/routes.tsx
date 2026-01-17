import CreateAccount from "@/pages/CreateAccount/CreateAccount";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import Homepage from "@/pages/Hompage/Homepage";
import Login from "@/pages/Login/Login";
import ResetPassword from "@/pages/ResetPassword/ResetPassword";
import Unavailable from "@/pages/Unavailable/Unavailable";
import VerifyAccount from "@/pages/VerifyAccount/VerifyAccount";

export type Route = {
  path: string;
  element: React.ReactNode;
  navbar?: "core" | "user" | "guest"; 
};

export const ROUTES: Route[] = [
  { 
    path: "/", 
    element: <Homepage />,
  },
  {
    path: "/verify-account",
    element: <VerifyAccount />,
    navbar: "core",
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
    navbar: "core",
  },
  {
    path: "/login",
    element: <Login />,
    navbar: "core",
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    navbar: "core",
  },
  {
    path: "/error",
    element: <ErrorPage />,
    navbar: "core",
  },
  {
    path: "/unavailable",
    element: <Unavailable />,
    navbar: "core",
  }
]