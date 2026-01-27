/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { sendVerificationCode, signUpUser } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { signupSchema, type SignupFormValues } from "./signupSchema";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import PasswordInput from "@/components/Inputs/PasswordInput/PasswordInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import ExistingAccount from "../../modals/errors/ExistingAccount/ExistingAccount";

type SignupFormProps = {
  onSuccess?: () => void;
};

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  //  - Form setup -- //
  const formMethods = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  // -- Handlers -- //
  const handleGoToLogin = () => {
    navigate("/login");
    return;
  };

  const handleOnSubmit = async (data: SignupFormValues) => {
  setIsLoading(true);

  try {
    // Clear any pending email on signup attempt
    localStorage.removeItem("pending_email");

    // Sign Up Process 
    // Adding minimum delay for better UX (1s)
    const result = await withMinDelay(
      signUpUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      }),
      1000
    );

    if (!result.success) {
      // Specific modal for existing account
      if (result.error.status === 422) {
        openModal(<ExistingAccount onContinue={handleGoToLogin} />);
        return;
      }

      // Throw for other errors
      throw result.error;
    }

    // On successful signup, send verification code
    const res = await sendVerificationCode(data.email, "signup");

    if (!res.success) {
      throw res.error;
    }

    // Move to next step (verify email)
    onSuccess?.();
  } catch (error: any) {
    handleSupabaseError(
      { code: error?.code ?? "SERVER_ERROR" },
      openModal
    );
  } finally {
    setIsLoading(false);
  }
};


  return (
    <FormProvider {...formMethods}>
      <FormBlock
        title={"Create Account"}
        question={"Let's get started"}
        buttons={{
          onCancel: { label: "Go to Log in", action: handleGoToLogin },
          onContinue: {
            label: "Sign Up",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <TextInput
          name={"firstName"}
          label={"First Name"}
          hasError={!!errors.firstName}
          errorMessage={errors.firstName?.message}
        />
        <TextInput
          name={"lastName"}
          label={"Last Name"}
          hasError={!!errors.lastName}
          errorMessage={errors.lastName?.message}
        />
        <TextInput
          name={"email"}
          label={"Email Address"}
          type="email"
          hasError={!!errors.email}
          errorMessage={errors.email?.message}
        />
        <PasswordInput
          name={"password"}
          label={"Create Password"}
          helperText="Minimum of 8 characters."
          hasError={!!errors.password}
          errorMessage={errors.password?.message}
        />
      </FormBlock>
    </FormProvider>
  );
};

export default SignupForm;
