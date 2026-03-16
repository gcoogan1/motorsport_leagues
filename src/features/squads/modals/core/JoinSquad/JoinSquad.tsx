import { useState } from "react";
import { useModal } from '@/providers/modal/useModal';
import { useToast } from "@/providers/toast/useToast";
import Dialog from '@/components/Dialog/Dialog'
import SquadNoProfile from '../SquadNoProfile/SquadNoProfile';
import AcceptJoinSquad from '@/features/squads/forms/Invite/AcceptJoinSquad/AcceptJoinSquad';
import { useJoinSquadAsMember } from "@/hooks/rtkQuery/mutations/useSquadMutation";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { navigate } from "@/app/navigation/navigation";
import { removeSquadInviteByToken } from "@/services/squad.service";

type JoinSquadProps = {
  squadId: string;
  hasProfile: boolean;
  token: string;
  profileId?: string;
}

const JoinSquad = ({ squadId, hasProfile, token, profileId }: JoinSquadProps) => {
  const { openModal, closeAllModals } = useModal();
  const { showToast } = useToast();
  const [joinSquadAsMember] = useJoinSquadAsMember();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      // accept the invite and join the squad as a member if the user has a profile
      if (profileId) {
        await withMinDelay(
          (async () => {
            await joinSquadAsMember({
              squadId,
              profileId,
              role: "member",
            }).unwrap();

            const inviteRemovalResult = await removeSquadInviteByToken(token);

            if (!inviteRemovalResult.success) {
              throw inviteRemovalResult.error;
            }
          })(),
          1000,
        );

        closeAllModals();
        navigate(`/squads/${squadId}`);
        showToast({
          usage: "success",
          message: "Joined Squad.",
        });
        return;
      }

      if (!hasProfile) {
        openModal(<SquadNoProfile type="join" />);
        return;
      }

      // If the user has a profile but no profileId is provided, open the AcceptJoinSquad modal to let them select a profile to join with
  openModal(<AcceptJoinSquad token={token} squadId={squadId} />);
    } catch {
      closeAllModals();
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <Dialog 
      type='core'
      title='Squad Invite'
      subtitle={`You’ve been invited to join this Squad.`}
      buttons={{
        onCancel: {
          label: 'Cancel',
          action: () => closeAllModals(),
        },
        onContinue: {
          label: 'Join Squad',
          action: () => handleContinue(),
          loading: isLoading,
          loadingText: 'Loading...',
        }
      }}
    />
  )
}

export default JoinSquad;