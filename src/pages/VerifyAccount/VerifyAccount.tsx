import { useSearchParams } from 'react-router';
import VerifyEmail from '@/features/auth/forms/VerifyEmail/VerifyEmail'
import { PageWrapper } from './VerifyAccount.styles'

const VerifyAccount = () => {

  const [searchParams] = useSearchParams();

  const purpose = (searchParams.get("purpose") as
    | "signup"
    | "reset_password") ?? "signup";

  return (
    <PageWrapper>
      <VerifyEmail purpose={purpose} />
    </PageWrapper>
  )
}

export default VerifyAccount