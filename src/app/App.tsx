import ReactGA from "react-ga4";

import AppRouter from "./routes/AppRouter";
import { AppThemeProvider } from "./design/AppThemeProvider";

const App = () => {

  // Initialize Google Analytics
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
  ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });

  return (
    <AppThemeProvider>
      <AppRouter />
    </AppThemeProvider>
  );
};

export default App;
