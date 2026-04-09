import { useModal } from '@/providers/modal/useModal';
import Dialog from '@/components/Dialog/Dialog'
import { navigate } from '@/app/navigation/navigation';

type LeagueCreatedProps = {
  leagueId: string;
}

const LeagueCreated = ({ leagueId }: LeagueCreatedProps) => {
  const { closeModal } = useModal();

  const handleManageLeague = () => {
    closeModal();
    navigate(`/league/${leagueId}/management`);
  }
  
  return (
    <Dialog 
      type='success'
      title='League Created!'
      subtitle={`Your League and it’s first Season have been successfully created. Go to Manage League to start customizing!`}
      buttons={{
        onCancel: { label: "Close", action: () => closeModal() },
        onContinue: {
          label: 'Manage League',
          action: handleManageLeague,
        }
      }}
    />
  )
}

export default LeagueCreated;