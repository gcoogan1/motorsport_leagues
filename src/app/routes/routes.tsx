import CreateAccount from "@/pages/CreateAccount/CreateAccount";
import Homepage from "@/pages/Hompage/Homepage";

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
    path: "/create-account",
    element: <CreateAccount />,
    navbar: "core",
  }
]