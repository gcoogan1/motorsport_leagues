/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from "react-redux";
import store from "@/store";
import { ModalProvider } from "@/providers/modal/ModalProvider";
import { PanelProvider } from "@/providers/panel/PanelProvider";
import { MockAuthProvider } from "@/providers/mock/MockAuthProvider";

export const withAppProviders = (Story: any) => {

  return (
    <Provider store={store}>
      <MockAuthProvider
        value={{
          user: null,
          session: null,
          isVerified: false,
          loading: false,
          refreshAuth: async () => {},
          resetAuth: async () => {},
        }}
      >
          <ModalProvider>
            <PanelProvider>
              <Story />
            </PanelProvider>
          </ModalProvider>
      </MockAuthProvider>
    </Provider>
  );
};
