import { createContext, type ReactNode } from "react";

type ModalContextType = {
  openModal: (modal: ReactNode) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType | undefined>(undefined);