import { useState } from "react";
import { useSelector } from "react-redux";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { navigate } from "@/app/navigation/navigation";
import type { RootState } from "@/store";
import { useAllNotifications } from "@/rtkQuery/hooks/queries/useNotifications";
import {
  useCreateNotification,
  useDeleteNotification,
} from "@/rtkQuery/hooks/mutations/useNotificationMutation";
import { useJoinLeagueAsParticipant } from "@/rtkQuery/hooks/mutations/useLeagueMutation";
import { removeLeagueInviteByToken } from "@/services/league/leagueInvite.service";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { LEAGUE_PARTICIPANT_ROLES } from "@/types/league.types";
import Dialog from "@/components/Dialog/Dialog";
import LeagueNoProfile from "../LeagueNoProfile/LeagueNoProfile";
import AcceptJoinLeague from "@/features/leagues/forms/Invite/AcceptJoinLeague/AcceptJoinLeague";

type LeagueInviteProps = {
  leagueId: string;
  hasProfile: boolean;
  token: string;
  profileId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  senderProfileId?: string;
  leagueName?: string;
  leagueRole?: typeof LEAGUE_PARTICIPANT_ROLES[number];
  notificationId?: string;
};

const LeagueInvite = ({
  leagueId,
  hasProfile,
  token,
  profileId,
  onSuccess,
  onCancel,
  senderProfileId,
  leagueName,
  leagueRole = "driver",
  notificationId,
}: LeagueInviteProps) => {
  const { openModal, closeAllModals } = useModal();
  const { showToast } = useToast();
  const [joinLeagueAsParticipant] = useJoinLeagueAsParticipant();
  const [createNotification] = useCreateNotification();
  const [deleteNotification] = useDeleteNotification();
  const [isLoading, setIsLoading] = useState(false);
  const profiles = useSelector((state: RootState) => state.profile.data ?? []);
  const myProfileIds = profiles.map((profile) => profile.id);
  const { refetch: refetchNotifications } = useAllNotifications(myProfileIds);

  const handleContinue = async () => {
    if (isLoading) {
      return;
    }

    if (!hasProfile) {
      closeAllModals();
      openModal(<LeagueNoProfile type="join" />);
      return;
    }

    if (!profileId) {
      closeAllModals();
      openModal(
        <AcceptJoinLeague
          token={token}
          leagueId={leagueId}
          onSuccess={onSuccess}
          senderProfileId={senderProfileId}
          leagueName={leagueName}
          leagueRole={leagueRole}
          notificationId={notificationId}
        />,
      );
      return;
    }

    try {
      setIsLoading(true);

      await withMinDelay(
        (async () => {
          const acceptedProfile = profiles.find((profile) => profile.id === profileId);

          if (!acceptedProfile) {
            throw new Error("Selected profile not found.");
          }

          await joinLeagueAsParticipant({
            leagueId,
            profileId,
            accountId: acceptedProfile.account_id,
            contactInfo: "",
            roles: [leagueRole],
          }).unwrap();

          const inviteRemovalResult = await removeLeagueInviteByToken(token);

          if (!inviteRemovalResult.success) {
            throw inviteRemovalResult.error;
          }

          if (notificationId) {
            await deleteNotification({ notificationId }).unwrap();
          }

          await refetchNotifications();

          if (senderProfileId && leagueName && acceptedProfile.username) {
            await createNotification({
              recipient_profile_id: senderProfileId,
              sender_account_id: acceptedProfile.account_id,
              sender_profile_id: acceptedProfile.id,
              entity_id: leagueId,
              type: "INVITE_ACCEPTED",
              entity_type: "league_invite",
              metadata: {
                league_name: leagueName,
                league_role: leagueRole,
                recipient_username: acceptedProfile.username,
              },
            }).unwrap();
          }
        })(),
        1000,
      );

      closeAllModals();
      navigate(`/league/${leagueId}`);
      onSuccess?.();
      showToast({
        usage: "success",
        message: "You’re now a participant of this League.",
      });
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    closeAllModals();
  };

  return (
    <Dialog
      type="core"
      title="League Invite"
      subtitle="You’ve been invited to join this League."
      buttons={{
        onCancel: {
          label: "Cancel",
          action: handleCancel,
        },
        onContinue: {
          label: "Join League",
          action: handleContinue,
          loading: isLoading,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default LeagueInvite;