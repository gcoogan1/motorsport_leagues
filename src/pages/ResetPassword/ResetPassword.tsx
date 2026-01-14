import { useNavigate, useSearchParams } from "react-router";
import ResetPasswordForm from "@/features/auth/forms/ResetPassword/ResetPasswordForm";
import { PageWrapper } from "./ResetPassword.styles";
import NewPasswordForm from "@/features/auth/forms/NewPassword/NewPasswordForm";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const status= (searchParams.get("status") as
    | "verify"
    | "new_password") ?? "verify";
    
  const navigate = useNavigate();

  const handleOnVerifySuccess = () => {
    navigate("/verify-account?purpose=reset_password");
  };

  return (
    <PageWrapper>
      {status === "verify" ? (
        <ResetPasswordForm onSuccess={handleOnVerifySuccess} />
      ) : (
        <NewPasswordForm  />
      )}
    </PageWrapper>
  );
};

export default ResetPassword;
