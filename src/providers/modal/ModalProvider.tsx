import { useState, type ReactNode } from "react";
import { ModalContext } from "./ModalContext";

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ReactNode[]>([]);

  const openModal = (modalComponent: ReactNode) => {
    setModal((prev) => [...prev, modalComponent]);
  };
  const closeModal = () => {
    setModal((prev) => prev.slice(0, -1));
  };
  const closeAllModals = () => {
    setModal([]);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      {modal}
    </ModalContext.Provider>
  );
};