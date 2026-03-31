import { useState } from "react";
import { useSelector } from "react-redux";
import { useModal } from '@/providers/modal/useModal';
import { useToast } from "@/providers/toast/useToast";
import Dialog from '@/components/Dialog/Dialog'
import SquadNoProfile from '../SquadNoProfile/SquadNoProfile';
import AcceptJoinSquad from '@/features/squads/forms/Invite/AcceptJoinSquad/AcceptJoinSquad';
import { useJoinSquadAsMember } from "@/hooks/rtkQuery/mutations/useSquadMutation";
import { useCreateNotification, useDeleteNotification } from "@/hooks/rtkQuery/mutations/useNotificationMutation";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { navigate } from "@/app/navigation/navigation";
import { removeSquadInviteByToken } from "@/services/squad.service";
import type { RootState } from "@/store";
import { useAllNotifications } from "@/hooks/rtkQuery/queries/useNotifications";

/* FIRST component rendered when user clicks "Join Squad" from a squad invite notification or a direct squad invite link. 
    Paths:
    1. User has no profile -> Show SquadNoProfile modal prompting them to create a profile before joining the squad
    2. User has a profile but no profileId is provided (edge case -> next step from the one above) -> Show AcceptJoinSquad modal prompting them to select a profile to join the squad with
    3. User has a profile and a profileId is provided -> Directly attempt to join the squad with the provided profileId
*/


type JoinSquadProps = {
  squadId: string;
  hasProfile: boolean;
  token: string;
  profileId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  senderAccountId?: string;
  senderProfileId?: string;
  squadName?: string;
  notificationId?: string;
}

const JoinSquad = ({
  squadId,
  hasProfile,
  token,
  profileId,
  onSuccess,
  onCancel,
  senderAccountId,
  senderProfileId,
  squadName,
  notificationId,
}: JoinSquadProps) => {
  const { openModal, closeAllModals } = useModal();
  const { showToast } = useToast();
  const [joinSquadAsMember] = useJoinSquadAsMember();
  const [createNotification] = useCreateNotification();
  const [deleteNotification] = useDeleteNotification();
  const [isLoading, setIsLoading] = useState(false);
  const profiles = useSelector((state: RootState) => state.profile.data ?? []);
  const myProfileIds = profiles?.map((profile) => profile.id) ?? [];
  const { refetch: refetchNotifications } = useAllNotifications(myProfileIds);


  const handleContinue = async () => {
    if (isLoading) return;

    if (!hasProfile) {
      closeAllModals();
      openModal(<SquadNoProfile type="join" />);
      return;
    }

    // If the user has a profile but no profileId is provided, open the AcceptJoinSquad modal to let them select a profile to join with
    if (!profileId) {
      closeAllModals();
      openModal(
        <AcceptJoinSquad
          token={token}
          squadId={squadId}
          onSuccess={onSuccess}
          senderProfileId={senderProfileId}
          squadName={squadName}
          notificationId={notificationId}
        />,
      );
      return;
    }

    try {
      setIsLoading(true);

      await withMinDelay(
        (async () => {
          await joinSquadAsMember({
            squadId,
            profileId,
            role: "member",
          }).unwrap();

          // REMOVE INVITE TOKEN
          const inviteRemovalResult = await removeSquadInviteByToken(token);

          if (!inviteRemovalResult.success) {
            throw inviteRemovalResult.error;
          }

          // DELETE NOTIFICATION -> IF APPLICABLE
          if (notificationId) {
            await deleteNotification({
              notificationId,
            }).unwrap();
          }
          // REFETCH NOTIFICATIONS TO UPDATE UI
          await refetchNotifications();

          const acceptedProfile = profiles.find((profile) => profile.id === profileId);

          // SEND ACCEPT NOTIFICATION TO INVITER (SENDER) -> IF APPLICABLE
          if (
            senderAccountId &&
            senderProfileId &&
            squadName &&
            acceptedProfile?.username
          ) {
            await createNotification({
              recipient_profile_id: senderProfileId,
              sender_account_id: acceptedProfile.account_id,
              sender_profile_id: acceptedProfile.id,
              entity_id: squadId,
              type: "INVITE_ACCEPTED",
              entity_type: "squad_invite",
              metadata: {
                squad_name: squadName,
                recipient_username: acceptedProfile.username,
              },
            }).unwrap();
          }
        })(),
        1000,
      );

      closeAllModals();
      navigate(`/squad/${squadId}`);
      onSuccess?.();
      showToast({
        usage: "success",
        message: "Joined Squad.",
      });
      return;
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = () => {
    onCancel?.();
    closeAllModals();
  }
  
  return (
    <Dialog 
      type='core'
      title='Squad Invite'
      subtitle={`You’ve been invited to join this Squad.`}
      buttons={{
        onCancel: {
          label: 'Cancel',
          action: handleCancel,
        },
        onContinue: {
          label: 'Join Squad',
          action: handleContinue,
          loading: isLoading,
          loadingText: 'Loading...',
        }
      }}
    />
  )
}

export default JoinSquad;