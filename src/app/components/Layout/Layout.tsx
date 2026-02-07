import { matchPath, Outlet, useLocation } from "react-router";
import { useAuth } from "@/providers/auth/useAuth";
import { ROUTES, type Route } from "@/app/routes/routes";
import { Main, Wrapper } from "./Layout.styles";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

//TODO: Add loading state while auth is being determined

const Layout = () => {
  const location = useLocation();
  const { user, isVerified } = useAuth();

  // Find the current route based on the location (matchPath allows for ids and nested routes)
  const currentRoute = ROUTES.find((route) =>
    matchPath({ path: route.path, end: true }, location.pathname),
  );

  // Determine navbar usage; if route specifies, use that, else base on auth status
  const userStatus = user && isVerified ? "user" : "guest";
  // Helper to get current usage
  const getCurrentUsage = (userSt: "user" | "guest", currentRt?: Route) => {
    if (!currentRt) {
      return "core";
    }
    return currentRt.navbar ? currentRt.navbar : userSt;
  };

  const usage = getCurrentUsage(userStatus, currentRoute);
  const userDetails = userStatus === "user" ? user : undefined;


  return (
    <Wrapper>
      <Navbar usage={usage} user={userDetails} />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default Layout;
