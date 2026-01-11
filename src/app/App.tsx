import ReactGA from "react-ga4";

import AppRouter from "./routes/AppRouter";
import { AppThemeProvider } from "../providers/theme/AppThemeProvider";
import { ModalProvider } from "../providers/modal/ModalProvider";
import { AuthProvider } from "@/providers/auth/AuthProvider";
// import Toast from "@/components/Messages/Toast/Toast";

//TODO: Re-enable Toast component once global state management is implemented

const App = () => {
  // Initialize Google Analytics
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
  });

  return (
    <AuthProvider>
      <AppThemeProvider>
        <ModalProvider>
          {/* Toast component temporarily disabled */}
          {/* <Toast usage="success" message="This is an informational message." /> */}
          <AppRouter />
        </ModalProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
};

export default App;
