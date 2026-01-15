import ReactGA from "react-ga4";
import { Provider } from "react-redux";

import store from "@/store";
import AppRouter from "./routes/AppRouter";
import { AppThemeProvider } from "../providers/theme/AppThemeProvider";
import { ModalProvider } from "../providers/modal/ModalProvider";
import { AuthProvider } from "@/providers/auth/AuthProvider";
import { PanelProvider } from "@/providers/panel/PanelProvider";
import { ToastProvider } from "@/providers/toast/ToastProvider";
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
    <Provider store={store}>
      <AuthProvider>
        <AppThemeProvider>
          <ToastProvider>
            <ModalProvider>
              <PanelProvider>
                <AppRouter />
              </PanelProvider>
            </ModalProvider>
          </ToastProvider>
        </AppThemeProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
