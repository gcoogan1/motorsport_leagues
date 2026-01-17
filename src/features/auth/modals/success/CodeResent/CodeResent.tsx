import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'

type CodeResentProps = {
  onContinue?: () => void;
};

const CodeResent = ({ onContinue }: CodeResentProps) => {
  const { closeModal } = useModal();

  const handleOnContinue = () => {
    closeModal();
    if (onContinue) {
      onContinue();
    } 
  }
  
  return (
    <Dialog 
      type='success'
      title='Verification Code Resent'
      subtitle='Another code has been sent to you at email@address.com. If you’ve still not received the code, check your spam folder and try again in 60 seconds.'
      buttons={{
        onContinue: {
          label: 'Okay',
          action: handleOnContinue
        }
      }}
    />
  )
}

export default CodeResent;