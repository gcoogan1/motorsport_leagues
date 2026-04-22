import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'


const RequestSent = () => {
  const { closeModal } = useModal();

  return (
    <Dialog 
      type='success'
      title='Request Sent'
      subtitle={`Your request to join the League has been sent to the Director(s) of this League.`}
      buttons={{
        onContinue: {
          label: 'Okay',
          action: () => closeModal(),
        }
      }}
    />
  )
}

export default RequestSent;