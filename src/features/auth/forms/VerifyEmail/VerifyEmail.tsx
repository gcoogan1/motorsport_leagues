/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { sendVerificationCode, verifyCode } from "@/services/auth.service";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { verifyEmailSchema, type VerifyEmailSchema } from "./verifyEmailSchema";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import AccountVerified from "../../modals/success/AccountVerifed/AccountVerified";
import CodeResent from "../../modals/success/CodeResent/CodeResent";

type VerifyEmailProps = {
  purpose: "signup" | "reset_password";
};

const VerifyEmail = ({ purpose = "signup" }: VerifyEmailProps) => {
  const { user, refreshAuth } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // --  Content based on purpose -- //
  const pendingEmail = localStorage.getItem("pending_email");
  const title = purpose === "signup" ? "Create Account" : "Reset Password";
  const email = purpose === "signup" && user ? user?.email : pendingEmail;
  const helperMessage =
    purpose === "signup"
      ? `We’ve sent a verification code to you at ${email}. Enter it below to finish creating your account.`
      : `If an account exists with the email, ${email}, you’ll receive a verification code. Enter it below to reset your password.`;

  // -- Form setup -- //
  const formMethods = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleGoToVerifyAccount = () => {
    navigate(`/verify-account?purpose=${purpose}`);
    return;
  };

  const handleGoToHome = () => {
    refreshAuth();
    navigate("/");
    openModal(<AccountVerified />);
    return;
  };

  const handleOnSubmit = async (data: VerifyEmailSchema) => {
    setIsLoading(true);
    // Ensure email is available
    if (!email) {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      return;
    }

    try {
      // Verify Code Process
      const result = await withMinDelay(
        verifyCode(email, data.verificationCode, purpose),
        1000,
      );

      if (!result.success) {
        // Set form error for invalid/expired code
        if (result.error.code === "INVALID_OR_EXPIRED_CODE") {
          setError("verificationCode", {
            type: "manual",
            message: "Incorrect code. Please try again.",
          });
          return;
        }
        throw result.error;
      }

      // On successful verification
      if (purpose === "reset_password") {
        navigate("/reset-password?status=new_password");
        return;
      }

      // For signup, go to home and show success modal
      handleGoToHome();
      return;
    } catch (error: any) {
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setResendLoading(true);
    if (!email) {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      return;
    }

    try {
      const result = await sendVerificationCode(email, purpose);
      if (!result.success) {
        throw result.error;
      }

      openModal(
        <CodeResent onContinue={handleGoToVerifyAccount} email={email} />,
      );
      return;
    } catch (error: any) {
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
      return;
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title={title}
        question={"Check your email"}
        helperMessage={helperMessage}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Resend Code", action: resendCode, loading: resendLoading, loadingText: "Loading..." },
          onContinue: {
            label: "Submit",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <TextInput
          name={"verificationCode"}
          label={"Verification Code"}
          hasError={!!errors.verificationCode}
          errorMessage={errors.verificationCode?.message}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default VerifyEmail;
