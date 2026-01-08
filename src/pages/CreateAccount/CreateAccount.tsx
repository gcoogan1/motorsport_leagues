import SignupForm from "@/features/auth/forms/Signup/SignupForm";
import VerifyEmail from "@/features/auth/forms/VerifyEmail/VerifyEmail";
import { PageWrapper } from "./CreateAccount.styles";
import { useAuth } from "@/providers/auth/useAuth";

const CreateAccount = () => {
  const { user, isVerified, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageWrapper>
      {!user && <SignupForm />}
      {user && !isVerified && <VerifyEmail />}
    </PageWrapper>
  );
};

export default CreateAccount;
