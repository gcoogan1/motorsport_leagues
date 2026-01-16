import { useDispatch } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import type { AppDispatch } from "@/store";
import { changeEmailThunk, fetchProfileThunk } from "@/store/profile/profile.thunks";
import { useToast } from "@/providers/toast/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import { useModal } from "@/providers/modal/ModalProvider";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import type { ProfileTable } from "@/types/profile.types";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { checkEmailSchema, type CheckEmailSchema } from "./checkEmailSchema";
import { sendVerificationCode, verifyCode } from "@/services/auth.service";
import CodeResent from "@/features/auth/modals/success/CodeResent/CodeResent";

type CheckEmailProps = {
  profile: ProfileTable;
  newEmail: string;
};

const CheckEmail = ({ profile, newEmail }: CheckEmailProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  // -- Form setup -- //
  const formMethods = useForm<CheckEmailSchema>({
    resolver: zodResolver(checkEmailSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: CheckEmailSchema) => {
    try {

      // Veify code
      const res = await verifyCode(
        newEmail,
        data.verificationCode,
        "change_email"
      );

      // Handle verification errors
      if (!res.success) {
        if (res.error.status === 400) {
          setError("verificationCode", {
            type: "manual",
            message: "Invalid verification code. Please try again.",
          });
          return;
        }
        handleSupabaseError({ status: res.error.status }, openModal);
        return;
      }

      // Update email in profile
      const profileRes = await dispatch(
        changeEmailThunk({
          newEmail: newEmail,
          userId: profile.id,
        })
      ).unwrap();

      // Handle profile update errors
      if (!profileRes.success) {
        handleSupabaseError({ status: 500 }, openModal);
        return;
      }

      // Refresh profile data
      dispatch(fetchProfileThunk(profile.id));
      // Show success toast and close modal
      showToast({
        usage: "success",
        message: "Email Address updated.",
      });
      closeModal();
    } catch (error) {
      console.error("Check email error:", error);
      handleSupabaseError({ status: 500 }, openModal);
      return;
    }
  };

  const handleRedirectBackToCheckEmail = () => {
    openModal(<CheckEmail profile={profile} newEmail={newEmail} />);
  };

  const handleResendCode = async () => {
    try {
      const res = await sendVerificationCode(newEmail, "change_email");
      if (!res.success) {
        handleSupabaseError({ status: res.error.status }, openModal);
        return;
      }
      openModal(<CodeResent onContinue={handleRedirectBackToCheckEmail} />);
    } catch (error) {
      console.error("Check email error:", error);
      handleSupabaseError({ status: 500 }, openModal);
      return;
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Check Email"}
        helperMessage={`We’ve sent a verification code to your new email address, ${newEmail}. Enter the code below to finalize changing your account’s email address.`}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Resend Code", action: handleResendCode },
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
      </FormModal>
    </FormProvider>
  );
};

export default CheckEmail;
