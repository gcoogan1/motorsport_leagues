import CreateAccount from "@/pages/CreateAccount/CreateAccount";
import CreateLeague from "@/pages/CreateLeague/CreateLeague";
import CreateProfile from "@/pages/CreateProfile/CreateProfile";
import CreateSquad from "@/pages/CreateSquad/CreateSquad";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
import Homepage from "@/pages/Hompage/Homepage";
import League from "@/pages/League/League";
import LeagueManagement from "@/pages/LeagueManagement/LeagueManagment";
import Login from "@/pages/Login/Login";
import Profile from "@/pages/Profile/Profile";
import ResetPassword from "@/pages/ResetPassword/ResetPassword";
import Squad from "@/pages/Squad/Squad";
import Unavailable from "@/pages/Unavailable/Unavailable";
import VerifyAccount from "@/pages/VerifyAccount/VerifyAccount";

export type Route = {
  path: string;
  element: React.ReactNode;
  navbar?: "core" | "user" | "guest"; 
  protected?: boolean; // If true, only accessible to authenticated users
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
    path: "/create-profile",
    element: <CreateProfile />,
    navbar: "core",
    protected: true,
  },
  {
    path: "/profile/:profileId",
    element: <Profile />,
  },
  {
    path: "/squad/:squadId",
    element: <Squad />,
  },
    { 
    path: "/squad/:squadId/invite/:token", 
    element: <Squad />,
  },
  {
    path: "/create-squad",
    element: <CreateSquad />,
    navbar: "core",
    protected: true,
  },
  {
    path: "/create-league",
    element: <CreateLeague />,
    navbar: "core",
    protected: true,
  },
  {
    path: "/league/:leagueId",
    element: <League />,
    navbar: "user",
    protected: true,
  },
  {
    path: "/league/:leagueId/management",
    element: <LeagueManagement />,
    navbar: "user",
    protected: true,
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
  },
  // Catch-all route for undefined paths (MUST BE LAST )
  {
    path: "*",
    element: <Unavailable />,
    navbar: "core", 
  },
]