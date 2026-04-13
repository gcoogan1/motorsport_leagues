import { useCallback, useMemo, useState, type ReactNode } from "react";
import { ModalContext } from "./ModalContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type ModalEntry = {
  id: string;
  node: ReactNode;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalEntry[]>([]);

  useLockBodyScroll(modal.length > 0);

  const openModal = useCallback((modalComponent: ReactNode) => {
    setModal((prev) => [
      ...prev,
      { id: crypto.randomUUID(), node: modalComponent },
    ]);
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => prev.slice(0, -1));
  }, []);

  const closeAllModals = useCallback(() => {
    setModal([]);
  }, []);

  const value = useMemo(
    () => ({ openModal, closeModal, closeAllModals }),
    [openModal, closeModal, closeAllModals],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modal.map((modalEntry) => (
        <div key={modalEntry.id}>{modalEntry.node}</div>
      ))}
    </ModalContext.Provider>
  );
};