import { createPortal } from "react-dom";
import type { ToastData } from "@/types/toast.types";
import ToastLayout from "./components/ToastLayout/ToastLayout";


const Toast = ({
  toasts,
  dismissToast,
}: {
  toasts: ToastData[];
  dismissToast: (id: string) => void;
}) => {
  if (!toasts.length) return null;

  return createPortal(
    <>
      {toasts.map((toast) => (
        <ToastLayout
          key={toast.id}
          usage={toast.usage}
          message={toast.message}
          onClose={() => dismissToast(toast.id)}
        />
      ))}
    </>,
    document.body
  );
};

export default Toast;
