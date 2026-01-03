import ReactGA from "react-ga4";

import AppRouter from "./routes/AppRouter";
import { AppThemeProvider } from "./design/AppThemeProvider";
// import Toast from "@/components/Messages/Toast/Toast";

//TODO: Re-enable Toast component once global state management is implemented

const App = () => {

  // Initialize Google Analytics
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
  ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });

  return (
    <AppThemeProvider>
      {/* Toast component temporarily disabled */}
      {/* <Toast usage="success" message="This is an informational message." /> */}
      <AppRouter />
    </AppThemeProvider>
  );
};

export default App;
