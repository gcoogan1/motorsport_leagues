import { Outlet, useLocation } from "react-router";

import { Main, Wrapper } from "./Layout.styles";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { ROUTES } from "@/app/routes/routes";

const Layout = () => {
  const location = useLocation();

  // Find the current route based on the location
  const currentRoute = ROUTES.find((route) => route.path === location.pathname);

  // Determine navbar usage based on current route or default to "core"
  const usage = currentRoute?.navbar || "core";

  return (
    <Wrapper>
      <Navbar usage={usage} />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default Layout;
