/* eslint-disable @typescript-eslint/no-explicit-any */
import Dialog from "@/components/Dialog/Dialog";
import { useModal } from "@/providers/modal/useModal";
import { sendVerificationCode } from "@/services/auth.service";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";

type UnverifiedAccountProps = {
  email: string;
  onVerify?: () => void;
};

const UnverifiedAccount = ({ email, onVerify }: UnverifiedAccountProps) => {
  const { openModal, closeModal } = useModal();

  const handleVerify = async () => {
    // Send verification code
    try {
      const result = await sendVerificationCode(email, "signup");

      if (!result.success) {
        throw result.error;
      }
      onVerify?.();
      closeModal();
    } catch (error: any) {
      handleSupabaseError({ status: error?.status ?? 500 }, openModal);
    } 
  };

  return (
    <Dialog
      type="alert"
      title="Your Account Is Unverified"
      subtitle={`Please verify your email, ${email}, to finalize creating your account.`}
      buttons={{
        onContinue: {
          label: "Verify",
          action: handleVerify,
        },
        onCancel: {
          label: "Cancel",
          action: () => {
            closeModal();
          },
        },
      }}
    />
  );
};

export default UnverifiedAccount;
