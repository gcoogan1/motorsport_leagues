import Dialog from '@/components/Dialog/Dialog'
import { useModal } from '@/providers/modal/useModal';

type TeamAssignedProps = {
  teamInEvent?: boolean;
};

const TeamAssigned = ({ teamInEvent }: TeamAssignedProps) => {
  const { closeModal } = useModal();

  const subtitle = teamInEvent
    ? "Drivers in this team are currently assigned to an event and cannot be deleted until they are unassigned."
    : "Team must be unassigned from their division before you can delete this team.";

  return (
    <Dialog 
      type='alert'
      title='Team Currently Assigned'
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

export default TeamAssigned;