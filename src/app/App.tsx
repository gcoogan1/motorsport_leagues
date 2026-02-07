import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import ReactGA from "react-ga4";

import store, { type AppDispatch } from "@/store";
import { fetchProfilesThunk } from "@/store/profile/profile.thunk";
import { fetchAccountThunk } from "@/store/account/account.thunks";
import { AuthProvider } from "@/providers/auth/AuthProvider";
import { PanelProvider } from "@/providers/panel/PanelProvider";
import { ToastProvider } from "@/providers/toast/ToastProvider";
import { useAuth } from "@/providers/auth/useAuth";
import AppRouter from "./routes/AppRouter";
import { AppThemeProvider } from "../providers/theme/AppThemeProvider";
import { ModalProvider } from "../providers/modal/ModalProvider";

// import Toast from "@/components/Messages/Toast/Toast";

//TODO: Re-enable Toast component once global state management is implemented

const AppContent = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccountThunk(user.id));
      dispatch(fetchProfilesThunk(user.id));
    }
  }, [user?.id, dispatch]);

  return <AppRouter />;
};

const App = () => {
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
                <AppContent />
              </PanelProvider>
            </ModalProvider>
          </ToastProvider>
        </AppThemeProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
