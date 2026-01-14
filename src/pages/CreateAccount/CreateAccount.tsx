import { useNavigate } from "react-router";
import SignupForm from "@/features/auth/forms/Signup/SignupForm";
import { PageWrapper } from "./CreateAccount.styles";

const CreateAccount = () => {

  const navigate = useNavigate();

  const handleOnSuccess = () => {
    navigate("/verify-account?purpose=signup");
  }

  return (
    <PageWrapper>
      <SignupForm onSuccess={handleOnSuccess} />
    </PageWrapper>
  );
};

export default CreateAccount;
