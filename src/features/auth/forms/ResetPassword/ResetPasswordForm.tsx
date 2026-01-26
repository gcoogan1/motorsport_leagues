/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { sendVerificationCode } from "@/services/auth.service";
import { resetPasswordSchema, type ResetPasswordSchema } from "./resetPasswordSchema";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import UnverifiedAccount from "../../modals/errors/UnverifiedAccount/UnverifiedAccount";

type ResetPasswordFormProps = {
  onSuccess?: () => void;
};

const ResetPasswordForm = ({ onSuccess }: ResetPasswordFormProps) => {
  const { resetAuth } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // -- Clear Auth //
  useEffect(() => {
    resetAuth();
  }, [resetAuth]);

  // -- Form setup -- //
  const formMethods = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  
  // -- Handlers -- //
  const handleVerify = () => {
    navigate("/verify-account?purpose=signup");
  };

  const handleOnSubmit = async (data: ResetPasswordSchema) => {
    setIsLoading(true);
    try {
      localStorage.setItem("pending_email", data.email);
      const res = await withMinDelay(
        sendVerificationCode(data.email, "reset_password"),
        1000,
      );

      if (!res.success) {
        // Unverified account modal
        if (res.error.code === "UNVERIFIED_ACCOUNT") {
          openModal(<UnverifiedAccount email={data.email} onVerify={handleVerify} />);
          return;
        }
        throw res.error;
      }
      // Success
      onSuccess?.();
    } catch (error: any) {
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title={"Reset Password"}
        question={"Enter Your Email"}
        helperMessage={"If an account exists with this email, we’ll send you a verification code."}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onContinue: {
            label: "Send Code",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <TextInput
          name={"email"}
          label={"Email"}
          hasError={!!errors.email}
          errorMessage={errors.email?.message}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default ResetPasswordForm;
