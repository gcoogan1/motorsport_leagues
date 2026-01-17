import { useState } from "react";
import { useNavigate } from "react-router";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "./signupSchema";
import { useModal } from "@/providers/modal/useModal";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import PasswordInput from "@/components/Inputs/PasswordInput/PasswordInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import { sendVerificationCode, signUpUser } from "@/services/auth.service";
import ExistingAccount from "../../modals/errors/ExistingAccount/ExistingAccount";

// TODO: Check if is loading is needed for buttons

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
  };

  const handleOnSubmit = async (data: SignupFormValues) => {
    try {
      // Clear any pending email on signup attempt
      localStorage.removeItem('pending_email');
      setIsLoading(true);

      // Sign Up Process
      const result = await signUpUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      if (!result.success) {
        // Specific modal for existing account
        if (result.error.status === 422) {
          openModal(<ExistingAccount onContinue={handleGoToLogin} />);
          return;
        }
        // Generals modal for other errors
        handleSupabaseError({ status: result.error.status }, openModal);
        return;
      }
      const res = await sendVerificationCode(data.email, "signup");
      if (!res.success) {
        // General modals for other errors
        handleSupabaseError({ status: res.error.status }, openModal);
        return;
      }
      // Move to next step (verify email)
      if (onSuccess) {
        onSuccess();
        return;
      }
    } catch (error) {
      handleSupabaseError({ status: 500 }, openModal);
      console.error("Signup error:", error);
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
          onCancel: { label: "Got to Log in", action: handleGoToLogin },
          onContinue: {
            label: "Sign Up",
            loading: isLoading,
            loadingText: "Please wait...",
            rightIcon: <ArrowForward />,
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

export default SignupForm;
