import { BrowserRouter as Router, Routes, Route } from "react-router";

import { ROUTES } from "./routes";
import Layout from "../components/Layout/Layout";
import { setNavigate } from "../navigation/navigation";
import NavigatorBridge from "../navigation/NavigatorBridge";
import { AppErrorBoundary } from "./AppErrorBoundry";
import { ScrollToTop } from "@/utils/scrollToTop";
import { ProtectedRoute } from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <Router>
      <NavigatorBridge onReady={setNavigate} />
      <AppErrorBoundary>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            {ROUTES.map(({ path, element, protected: isProtected }) => (
              <Route key={path} path={path} element={
                isProtected ? <ProtectedRoute>{element}</ProtectedRoute> : element
              } />
            ))}
          </Route>
        </Routes>
      </AppErrorBoundary>
    </Router>
  );
};

export default AppRouter;
