import { Outlet, useLocation } from "react-router";
import { useAuth } from "@/providers/auth/useAuth";
import { ROUTES } from "@/app/routes/routes";
import { Main, Wrapper } from "./Layout.styles";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

//TODO: Add loading state while auth is being determined

const Layout = () => {
  const location = useLocation();
  const { user, isVerified, loading } = useAuth();

  // Find the current route based on the location
  const currentRoute = ROUTES.find((route) => route.path === location.pathname);

  // Determine navbar usage; if route specifies, use that, else base on auth status
  const userStatus = user && isVerified ? "user" : "guest";
  const usage = currentRoute?.navbar ? currentRoute.navbar : userStatus;
  const userDetails = userStatus === "user" ? user : undefined;

  return (
    <Wrapper>
      {!loading && <Navbar usage={usage} user={userDetails} />}
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default Layout;
