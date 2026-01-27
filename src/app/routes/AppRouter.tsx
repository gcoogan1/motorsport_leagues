import { BrowserRouter as Router, Routes, Route } from "react-router";

import { ROUTES } from "./routes";
import Layout from "../components/Layout/Layout";
import { setNavigate } from "../navigation/navigation";
import NavigatorBridge from "../navigation/NavigatorBridge";
import { AppErrorBoundary } from "./AppErrorBoundry";
import { ScrollToTop } from "@/utils/scrollToTop";

//TODO: Add route protection logic based on authentication status

const AppRouter = () => {
  return (
    <Router>
      <NavigatorBridge onReady={setNavigate} />
      <AppErrorBoundary>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            {ROUTES.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Route>
        </Routes>
      </AppErrorBoundary>
    </Router>
  );
};

export default AppRouter;
