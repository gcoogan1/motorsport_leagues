import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "./signupSchema";
import { useModal } from "@/providers/modal/ModalProvider";
import FormBlock from "@/components/Forms/FormBlock/FormBlock";
import PasswordInput from "@/components/Inputs/PasswordInput/PasswordInput";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import { sendVerificationCode, signUpUser } from "@/services/auth.service";
import ExistingAccount from "../../modals/errors/ExistingAccount/ExistingAccount";
import { useNavigate } from "react-router";

// TODO: Remove console logs

type SignupFormProps = {
  onSuccess?: () => void;
};

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { openModal } = useModal();
  const navigate = useNavigate();

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
    // navigate("/login");
    navigate("/")
  };
  
  const handleOnSubmit = async (data: SignupFormValues) => {
    try {
      try {
        const result = await signUpUser({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        });
        if (!result.success) {
          if (result.error.status === 422) {
            // Open existing account modal
            openModal(<ExistingAccount onContinue={handleGoToLogin} />);
            return;
          }
          // Open appropriate error modal
          handleSupabaseError({ status: result.error.status }, openModal);
        } else {
          const res = await sendVerificationCode(data.email);
          if (!res.success) {
            // Open appropriate error modal
            handleSupabaseError({ status: res.error.status }, openModal);
            return;
          }
          // Move to next step (verify email)
          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (error) {
        handleSupabaseError({ status: 500 }, openModal);
        console.error("Signup error:", error);
      }
    } catch (error) {
      handleSupabaseError({ status: 500 }, openModal);
      console.error("Signup error:", error);
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
