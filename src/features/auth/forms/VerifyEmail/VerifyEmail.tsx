import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/ModalProvider";
import { sendVerificationCode, verifyCode } from "@/services/auth.service";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { verifyEmailSchema, type VerifyEmailSchema } from "./verifyEmailSchema";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import AccountVerified from "../../modals/success/AccountVerifed/AccountVerified";
import CodeResent from "../../modals/success/CodeResent/CodeResent";

const VerifyEmail = () => {
  const { user, refreshAuth } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();

  // -- Form setup -- //
  const formMethods = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  
  // -- Handlers -- //
  const handleGoToVerifyAccount = () => {
    navigate("/verify-account");
  };

  const handleGoToHome = () => {
    refreshAuth();
    navigate("/");
  }

  const handleOnSubmit = async (data: VerifyEmailSchema) => {
    if (!user || !user.email) {
      handleSupabaseError({ status: 500 }, openModal);
      console.error("No user or user email found for verification.");
      return;
    }

    try {
      const result = await verifyCode(user.email, data.verificationCode, "signup");
      if (!result.success) {
        console.error("Verification failed:", result.error);
        handleSupabaseError({ status: result.error.status }, openModal);
      } else {
        openModal(<AccountVerified onContinue={handleGoToHome} />);
      }
    } catch (error) {
      console.error("Verification error:", error);
      handleSupabaseError({ status: 500 }, openModal);
    }
  };

  const resendCode = async () => {
    if (!user || !user.email) {
      handleSupabaseError({ status: 500 }, openModal);
      console.error("No user or user email found to resend code.");
      return;
    }

    try {
      const result = await sendVerificationCode(user.email, "signup");
      if (!result.success) {
        console.error("Resend code failed:", result.error);
        handleSupabaseError({ status: result.error.status }, openModal);
      } else {
        openModal(<CodeResent onContinue={handleGoToVerifyAccount} />);
      }
    } catch (error) {
      console.error("Resend code error:", error);
      handleSupabaseError({ status: 500 }, openModal);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title={"Create Account"}
        question={"Check your email."}
        helperMessage={`We’ve sent a verification code to you at ${user?.email}. Enter it below to finish creating your account.`}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Resend Code", action: resendCode },
          onContinue: {
            label: "Submit",
            rightIcon: <ArrowForward />,
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
