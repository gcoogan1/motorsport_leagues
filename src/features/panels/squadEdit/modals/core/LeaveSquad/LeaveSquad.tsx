import Dialog from '@/components/Dialog/Dialog'
import { useRemoveMemberFromSquad } from '@/hooks/rtkQuery/mutations/useSquadMutation';
import { useModal } from '@/providers/modal/useModal';
import { useToast } from '@/providers/toast/useToast';
import { handleSupabaseError } from '@/utils/handleSupabaseErrors';
import { withMinDelay } from '@/utils/withMinDelay';
import { useState } from 'react';

type LeaveSquadProps = {
  squadId: string;
  profileId: string;
}

const LeaveSquad = ({ squadId, profileId }: LeaveSquadProps) => {
  const { openModal, closeModal } = useModal();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [removeSquadMember] = useRemoveMemberFromSquad();
  
    const handleLeaveSquad = async () => {
      try {
        setIsLoading(true);
        const res = await withMinDelay(
          removeSquadMember({
            squadId,
            profileId,
          }).unwrap(),
          1000,
        );
  
        if (!res.success) {
          throw new Error("Failed to leave squad");
        }
        showToast({
          usage: "success",
          message: "You’ve left the Squad.",
        });
      } catch {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      } finally {
        setIsLoading(false);
        closeModal();
      }
    };
  
  return (
    <Dialog 
      type='core'
      title='Leave Squad'
      subtitle="You will no longer be a Member of this Squad."
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Leave Squad",
          isDanger: true,
          action: () => handleLeaveSquad(),
          loading: isLoading,
          loadingText: "Loading...",
        },
      }}
    />
  )
}

export default LeaveSquad;