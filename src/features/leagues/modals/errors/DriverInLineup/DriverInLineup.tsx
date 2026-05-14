import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

const DriverInLineup = () => {
  const { closeModal } = useModal();

  return (
    <Dialog
      type='alert'
      title='Driver is Assigned in Lineup'
      subtitle='There are drivers in the current season’s lineup that need to be unassigned before you can remove their role or remove them from the league.'
      buttons={{
        onContinue: {
          label: 'Okay',
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default DriverInLineup;
