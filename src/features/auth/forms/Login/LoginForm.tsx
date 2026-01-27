/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { loginUser } from "@/services/auth.service";
import { loginSchema, type LoginFormValues } from "./loginSchema";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import PasswordInput from "@/components/Inputs/PasswordInput/PasswordInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import UnverifiedAccount from "../../modals/errors/UnverifiedAccount/UnverifiedAccount";
import AccountSuspended from "../../modals/errors/AccountSuspended/AccountSuspended";

type LoginFormProps = {
  onSuccess?: () => void;
};

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
    return;
  };

  const handleVerify = () => {
    navigate("/verify-account?purpose=signup");
    return
  };

  const handleOnSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      // Clear any pending email on login attempt
      localStorage.removeItem("pending_email");

      // Log In Process
      // Adding minimum delay for better UX (1s)
      const result = await withMinDelay(
        loginUser({
          email: data.email,
          password: data.password,
        }),
        1000,
      );

      if (!result.success) {
        // Special modal for banned users (rare case)
        if (result.error.status === 400) {
          if (result.error.code === "user_banned") {
            openModal(<AccountSuspended />);
            return;
          }
        }

        // Unverified account modal
        if (result.error.status === 401) {
          openModal(
            <UnverifiedAccount onVerify={handleVerify} email={data.email} />,
          );
          return;
        }

        // Throw for other errors
        throw result.error;
      }

      // Successful login
      onSuccess?.();
    } catch (error: any) {
      handleSupabaseError({ code: error?.code ?? "SERVER_ERROR"}, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title={"Log In"}
        question="Welcome Back!"
        buttons={{
          onCancel: { label: "Forgot Password?", action: handleResetPassword },
          onContinue: {
            label: "Log In",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <TextInput
          name={"email"}
          label={"Email"}
          type="email"
          hasError={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <PasswordInput
          name={"password"}
          label={"Password"}
          hasError={!!errors.password}
          errorMessage={errors.password?.message}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default LoginForm;
