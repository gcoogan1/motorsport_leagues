import type { ToastData } from "@/types/toast.types";
import { type ReactNode, useState } from "react";
import { ToastContext } from "./ToastContext";
import Toast from "@/components/Messages/Toast/Toast";




export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = (toast: Omit<ToastData, "id">) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { ...toast, id }]);

    // Auto dismiss
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <Toast toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  );
};
