import { useNavigate } from "react-router";
import SignupForm from "@/features/auth/forms/Signup/SignupForm";
import { PageWrapper } from "./CreateAccount.styles";
import { useAnalytics } from "@/hooks/useAnalytics";

const CreateAccount = () => {

  const navigate = useNavigate();
  const { track } = useAnalytics();

  const handleOnSuccess = () => {
    track("signup_complete", { onboarding_step: "success", page_section: "CreateAccount" });
    navigate("/verify-account?purpose=signup");
  }

  return (
    <PageWrapper>
      <SignupForm onSuccess={handleOnSuccess} />
    </PageWrapper>
  );
};

export default CreateAccount;
