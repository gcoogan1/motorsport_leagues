import type { AuthContextType } from "../../types/auth.types";
import { AuthContext } from "../auth/AuthContext";
import { ModalProvider } from "../modal/ModalProvider";

// -- Mock Authentication Provider -- //
//  - Used for testing and Storybook - //

// Note: Wraps children with AuthContext and ModalProvider (for error and success modals)

type Props = {
  value: AuthContextType;
  children: React.ReactNode;
};

export const MockAuthProvider = ({ value, children }: Props) => {
  return (
    <AuthContext.Provider value={value}>
      <ModalProvider>
        {children}
      </ModalProvider>
    </AuthContext.Provider>
  );
};