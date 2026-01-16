import { FormProvider, useForm } from "react-hook-form";
import { useToast } from "@/providers/toast/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import { useModal } from "@/providers/modal/ModalProvider";
import type { ProfileTable } from "@/types/profile.types";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "./changePasswordSchema";
import PasswordInput from "@/components/Inputs/PasswordInput/PasswordInput";
import { changePassword, verifyPassword } from "@/services/auth.service";
import IncorrectPassword from "../../modals/errors/IncorrectPassword/IncorrectPassword";

type ChangePasswordProps = {
  profile: ProfileTable;
};

const ChangePassword = ({ profile }: ChangePasswordProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();

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
    try {
      // Verify current password
      const res = await verifyPassword({
        password: data.currentPassword,
        email: profile.email,
      });
      if (!res.success) {
        openModal(<IncorrectPassword />);
        return;
      }

      // Update to new password
      const updateRes = await changePassword(data.newPassword);
      if (!updateRes.success) {
        handleSupabaseError(
          { status: updateRes.error?.status },
          openModal
        );
        return;
      }

      showToast({
        usage: "success",
        message: "Password updated.",
      });

      closeModal();
    } catch (error) {
      console.error("Check email error:", error);
      handleSupabaseError({ status: 500 }, openModal);
      return;
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Change Password"}
        helperMessage={`Enter your current and your new password. If you do not remember your current password, you can log out and reset your password by your email.`}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel" },
          onContinue: {
            label: "Update Password",
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
          errorMessage={errors.newPassword?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default ChangePassword;
