import { BrowserRouter as Router, Routes, Route } from "react-router";

import { ROUTES } from "./routes";
import Layout from "../components/Layout/Layout";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {ROUTES.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
