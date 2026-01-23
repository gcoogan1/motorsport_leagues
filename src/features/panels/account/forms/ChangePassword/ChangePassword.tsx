/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "@/providers/toast/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { changePassword, verifyPassword } from "@/services/auth.service";
import type { ProfileTable } from "@/types/profile.types";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "./changePasswordSchema";
import FormModal from "@/components/Forms/FormModal/FormModal";
import PasswordInput from "@/components/Inputs/PasswordInput/PasswordInput";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import IncorrectPassword from "../../modals/errors/IncorrectPassword/IncorrectPassword";

type ChangePasswordProps = {
  profile: ProfileTable;
};

const ChangePassword = ({ profile }: ChangePasswordProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // -- Form setup -- //
  const formMethods = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleOnSubmit = async (data: ChangePasswordSchema) => {
    setIsLoading(true);
    try {
      // Verify current password
      const res = await withMinDelay(
        verifyPassword({
          password: data.currentPassword,
          email: profile.email,
        }),
        1000,
      );

      // If current password is incorrect
      if (!res.success) {
        openModal(<IncorrectPassword />);
        return;
      }

      // Update to new password
      const updateRes = await changePassword(data.newPassword);
      if (!updateRes.success) {
        throw updateRes.error;
      }

      // Success
      showToast({
        usage: "success",
        message: "Password updated.",
      });
      closeModal();
    } catch (error: any) {
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR" }, openModal);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Change Password"}
        helperMessage={`Enter your current and your new password. If you do not remember your current password, you can log out and reset your password by your email.`}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
          onContinue: {
            label: "Update Password",
            loading: isLoading,
            loadingText: "Loading...",
            rightIcon: <ArrowForward />,
          },
        }}
      >
        <PasswordInput
          name="currentPassword"
          label="Current Password"
          hasError={!!errors.currentPassword}
          errorMessage={errors.currentPassword?.message}
        />
        <PasswordInput
          name="newPassword"
          label="New Password"
          hasError={!!errors.newPassword}
          helperText="Minimum of 8 characters."
          errorMessage={errors.newPassword?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default ChangePassword;
