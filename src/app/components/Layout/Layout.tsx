import { Outlet, useLocation } from "react-router";
import { useAuth } from "@/providers/auth/useAuth";
import { ROUTES } from "@/app/routes/routes";
import { Main, Wrapper } from "./Layout.styles";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

const Layout = () => {
  const location = useLocation();
  const { user, isVerified } = useAuth();

  // Find the current route based on the location
  const currentRoute = ROUTES.find((route) => route.path === location.pathname);

  // Determine navbar usage; if route specifies, use that, else base on auth status
  const userStatus = user && isVerified ? "user" : "guest";
  const usage = currentRoute?.navbar || userStatus;

  return (
    <Wrapper>
      <Navbar usage={usage} user={userStatus && user} />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default Layout;
