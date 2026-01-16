import { useModal } from "@/providers/modal/ModalProvider";
import { modalVariants } from "@/types/modal.types";

// -- Supabase Modal Error Handler -- //

type SupabaseError = {
  status?: number;
};

export const handleSupabaseError = (
  error: SupabaseError,
  openModal: ReturnType<typeof useModal>["openModal"]
) => {
  // Map of supabase status codes to modal types
  const statusModalMap: Record<number, keyof typeof modalVariants> = {
    409: "EXISTING_EMAIL",
    422: "EXISTING_ACCOUNT",
    429: "ATTEMPT_MAX",        
    430: "REQUEST_MAX", 
    500: "SERVER_ERROR",       
  };

  const modalKey = error.status && statusModalMap[error.status]
    ? statusModalMap[error.status]
    : "SERVER_ERROR";      

  // render the appropriate modal
  const ModalComponent = modalVariants[modalKey];
  openModal(<ModalComponent />);
};
