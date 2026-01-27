/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppDispatch } from "@/store";
import type { AccountTable } from "@/types/account.types";
import {
  changeEmailThunk,
  fetchAccountThunk,
} from "@/store/account/account.thunks";
import { useToast } from "@/providers/toast/useToast";
import { sendVerificationCode, verifyCode } from "@/services/auth.service";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { checkEmailSchema, type CheckEmailSchema } from "./checkEmailSchema";
import FormModal from "@/components/Forms/FormModal/FormModal";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import CodeResent from "@/features/auth/modals/success/CodeResent/CodeResent";
import Button from "@/components/Button/Button";

type CheckEmailProps = {
  account: AccountTable;
  newEmail: string;
};

const CheckEmail = ({ account, newEmail }: CheckEmailProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
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
    setIsLoading(true);
    try {
      // Veify code
      const res = await withMinDelay(
        verifyCode(newEmail, data.verificationCode, "change_email"),
        1000,
      );

      // Handle verification errors
      if (!res.success) {
        // Set form error for invalid/expired code
        if (res.error.code === "INVALID_OR_EXPIRED_CODE") {
          setError("verificationCode", {
            type: "manual",
            message: "Incorrect code. Please try again.",
          });
          return;
        }
        throw res.error;
      }

      // Update email in account
      const accountRes = await dispatch(
        changeEmailThunk({
          newEmail: newEmail,
          userId: account.id,
        }),
      ).unwrap();

      // Handle account update errors
      if (!accountRes.success && accountRes.error) {
        throw accountRes.error;
      }

      // Refresh account data
      dispatch(fetchAccountThunk(account.id));
      // Show success toast and close modal
      showToast({
        usage: "success",
        message: "Email Address updated.",
      });
      closeModal();
    } catch (error: any) {
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectBackToCheckEmail = () => {
    openModal(<CheckEmail account={account} newEmail={newEmail} />);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const res = await sendVerificationCode(newEmail, "change_email");
      if (!res.success) {
        throw res.error;
      }
      // Open code resent modal
      openModal(
        <CodeResent
          onContinue={handleRedirectBackToCheckEmail}
          email={newEmail}
        />,
      );
    } catch (error: any) {
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
      return;
    } finally {
      setIsResending(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Check Your Email"}
        helperMessage={`We’ve sent a verification code to your new email address, ${newEmail}. Enter the code below to finalize changing your account’s email address.`}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
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
          type="number"
          hasError={!!errors.verificationCode}
          errorMessage={errors.verificationCode?.message}
        />
        <div style={{ alignSelf: "center" }}>
          <Button
            onClick={handleResendCode}
            variant="ghost"
            color="base"
            ariaLabel="Resend Code"
            isLoading={isResending}
            loadingText="Loading..."
          >
            Resend Code
          </Button>
        </div>
      </FormModal>
    </FormProvider>
  );
};

export default CheckEmail;
