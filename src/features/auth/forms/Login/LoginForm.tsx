import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { loginSchema, type LoginFormValues } from "./loginSchema";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { loginUser } from "@/services/auth.service";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import PasswordInput from "@/components/Inputs/PasswordInput/PasswordInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import IncorrectCred from "../../modals/errors/IncorrectCred/IncorrectCred";
import UnverifiedAccount from "../../modals/errors/UnverifiedAccount/UnverifiedAccount";
import AccountSuspended from "../../modals/errors/AccountSuspended/AccountSuspended";

type LoginFormProps = {
  onSuccess?: () => void;
};

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { openModal } = useModal();
  const navigate = useNavigate();

  //  - Form setup -- //
  const formMethods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleResetPassword = () => {
    navigate("/reset-password?status=verify");
  };

  const handleVerify = () => {
    navigate("/verify-account?purpose=signup");
  };

  const handleOnSubmit = async (data: LoginFormValues) => {
    try {
      // Clear any pending email on login attempt
      localStorage.removeItem('pending_email');

      // Log In Process
      const result = await loginUser({
        email: data.email,
        password: data.password,
      });
      if (!result.success && result?.error?.status) {
        // Specific modals for incorrect credentials and unverified accounts
        if (result.error.status === 400) {
          // Special modal for banned users (rare case)
          if (result.error.code === "user_banned") {
            openModal(<AccountSuspended />);
            return;
          }
          // else show incorrect credentials modal
          openModal(<IncorrectCred onResetPassword={handleResetPassword} />);
          return;
        }
        if (result.error.status === 401) {
          openModal(
            <UnverifiedAccount onVerify={handleVerify} email={data.email} />
          );
          return;
        }

        // General modals for other errors
        handleSupabaseError({ status: result.error.status }, openModal);
        return;
      } else {
        if (onSuccess) {
          onSuccess();
          return;
        }
      }
    } catch (error) {
      handleSupabaseError({ status: 500 }, openModal);
      console.error("Login error:", error);
      return;
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title={"Log In"}
        question="Welcome Back"
        buttons={{
          onCancel: { label: "Forgot Password?", action: handleResetPassword },
          onContinue: {
            label: "Log In",
            rightIcon: <ArrowForward />,
          },
        }}
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <TextInput
          name={"email"}
          label={"Email"}
          hasError={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <PasswordInput
          name={"password"}
          label={"Password"}
          helperText="Minimum of 8 characters."
          hasError={!!errors.password}
          errorMessage={errors.password?.message}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default LoginForm;
