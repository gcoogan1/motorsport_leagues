// -- Toast Usage Type -- //
export type ToastUsage = "success" | "error" | "info";

// -- Toast Data Type -- //
export type ToastData = {
  id: string;
  usage: ToastUsage;
  message: string;
};

// -- Toast Context Type -- //
export type ToastContextType = {
  showToast: (toast: Omit<ToastData, "id">) => void;
  dismissToast: (id: string) => void;
};

