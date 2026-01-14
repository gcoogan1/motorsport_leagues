import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/ModalProvider";
import { sendVerificationCode } from "@/services/auth.service";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import { resetPasswordSchema, type ResetPasswordSchema } from "./resetPasswordSchema";
import UnverifiedAccount from "../../modals/errors/UnverifiedAccount/UnverifiedAccount";
import { useAuth } from "@/providers/auth/useAuth";
import { useEffect } from "react";

type ResetPasswordFormProps = {
  onSuccess?: () => void;
};

const ResetPasswordForm = ({ onSuccess }: ResetPasswordFormProps) => {
  const { resetAuth } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();

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
    try {
      localStorage.setItem("pending_email", data.email);
      const res = await sendVerificationCode(data.email, "reset_password");
      if (!res.success) {
        if (res.error.status === 403) {
          openModal(<UnverifiedAccount email={data.email} onVerify={handleVerify} />);
          return;
        }
        handleSupabaseError({ status: res.error.status }, openModal);
        return;
      }
      if (onSuccess) {
        onSuccess();
        return;
      }
    } catch (error) {
      handleSupabaseError({ status: 500 }, openModal);
      console.error("Reset password error:", error);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title={"Reset Password"}
        question={"Enter Your Email"}
        helperMessage={"We’ll send you a verification code."}
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onContinue: {
            label: "Send Code",
            rightIcon: <ArrowForward />,
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
