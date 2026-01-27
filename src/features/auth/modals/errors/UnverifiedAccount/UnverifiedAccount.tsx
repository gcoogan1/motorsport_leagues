/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { sendVerificationCode } from "@/services/auth.service";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import Dialog from "@/components/Dialog/Dialog";

type UnverifiedAccountProps = {
  email: string;
  onVerify?: () => void;
};

const UnverifiedAccount = ({ email, onVerify }: UnverifiedAccountProps) => {
  const { openModal, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    setIsLoading(true);
    // Send verification code
    try {
      const result = await sendVerificationCode(email, "signup");

      if (!result.success) {
        throw result.error;
      }
      onVerify?.();
      closeModal();
    } catch (error: any) {
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
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
          loading: isLoading,
          loadingText: "Loading...",
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
