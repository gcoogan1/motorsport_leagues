import { useNavigate } from 'react-router';
import { PageWrapper } from './Login.styles'
import LoginForm from '@/features/auth/forms/Login/LoginForm'

const Login = () => {
  const navigate = useNavigate();

  const handleOnSuccess = () => {
    navigate("/");
  }

  return (
    <PageWrapper>
      <LoginForm onSuccess={handleOnSuccess} />
    </PageWrapper>
  )
}

export default Login