import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

type NoTeamsProps = {
  isPreQual?: boolean;
}

const NoTeams = ({ isPreQual }: NoTeamsProps) => {
  const { closeModal } = useModal();

  const title = isPreQual ? 'No Teams Available' : 'No Teams Created';
  const subtitle = isPreQual
    ? 'Please add new teams from the Pre-Qualifying division.'
    : 'Please create a team before assigning drivers.';
  
  return (
    <Dialog 
      type='alert'
      title={title}
      subtitle={subtitle}
      buttons={{
        onContinue: {
          label: "Okay",
          action: () => closeModal(),
        },
      }}
    />
  )
}

export default NoTeams;