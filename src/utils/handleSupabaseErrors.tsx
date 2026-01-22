import { useModal } from "@/providers/modal/useModal";
import { modalVariants } from "@/types/modal.types";

// -- Supabase Modal Error Handler -- //

type SupabaseError = {
  code?: keyof typeof modalVariants;
};

export const handleSupabaseError = (
  error: SupabaseError,
  openModal: ReturnType<typeof useModal>["openModal"]
) => {
  const modalKey =
    error.code && modalVariants[error.code]
      ? error.code
      : "SERVER_ERROR";

  const ModalComponent = modalVariants[modalKey];
  openModal(<ModalComponent />);
};
