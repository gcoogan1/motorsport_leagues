import { useState } from "react";
import { useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import type { RootState } from "@/store";
import { useToast } from "@/providers/toast/useToast";
import { useModal } from "@/providers/modal/useModal";
import {
  useCreateNotification,
  useDeleteNotification,
} from "@/rtkQuery/hooks/mutations/useNotificationMutation";
import { useJoinLeagueAsParticipant } from "@/rtkQuery/hooks/mutations/useLeagueMutation";
import { useAllNotifications } from "@/rtkQuery/hooks/queries/useNotifications";
import { useLeagueParticipants } from "@/rtkQuery/hooks/queries/useLeagues";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { navigate } from "@/app/navigation/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import {
  getLeagueInviteTableByToken,
  removeLeagueInviteByToken,
} from "@/services/league/leagueInvite.service";
import { LEAGUE_PARTICIPANT_ROLES } from "@/types/league.types";
import { joinLeagueSchema, type JoinLeagueFormValues } from "./acceptJoinLeague.schema";

type AcceptJoinLeagueProps = {
  token: string;
  leagueId: string;
  onSuccess?: () => void;
  senderProfileId?: string;
  leagueName?: string;
  leagueRole: typeof LEAGUE_PARTICIPANT_ROLES[number];
  notificationId?: string;
};

const AcceptJoinLeague = ({
  token,
  leagueId,
  onSuccess,
  senderProfileId,
  leagueName,
  leagueRole,
  notificationId,
}: AcceptJoinLeagueProps) => {
  const { openModal, closeAllModals } = useModal();
  const { showToast } = useToast();
  const [joinLeagueAsParticipant] = useJoinLeagueAsParticipant();
  const [createNotification] = useCreateNotification();
  const [deleteNotification] = useDeleteNotification();
  const [isLoading, setIsLoading] = useState(false);
  const profiles = useSelector((state: RootState) => state.profile.data ?? []);
  const { data: participants = [] } = useLeagueParticipants(leagueId);
  const participantProfileIds = new Set(
    participants.map((participant) => participant.profile_id),
  );
  const availableProfiles = profiles.filter(
    (profile) => !participantProfileIds.has(profile.id),
  );
  const myProfileIds = profiles.map((profile) => profile.id);
  const { refetch: refetchNotifications } = useAllNotifications(myProfileIds);
  const formattedProfiles = convertProfilesToSelectOptions(availableProfiles);

  const formMethods = useForm<JoinLeagueFormValues>({
    resolver: zodResolver(joinLeagueSchema),
    defaultValues: {
      profile_joining: availableProfiles[0]?.id ?? "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = formMethods;

  const handleOnSubmit = async (data: JoinLeagueFormValues) => {
    if (!data.profile_joining) {
      setError("profile_joining", {
        type: "manual",
        message: availableProfiles.length
          ? "Please select a profile."
          : "All of your profiles are already participants in this League.",
      });
      return;
    }

    try {
      setIsLoading(true);

      await withMinDelay(
        (async () => {
          const inviteTableResult = await getLeagueInviteTableByToken(token);

          if (!inviteTableResult.success) {
            throw inviteTableResult.error;
          }

          const acceptedProfile = profiles.find(
            (profile) => profile.id === data.profile_joining,
          );

          if (!acceptedProfile) {
            throw new Error("Selected profile not found.");
          }

          const inviteEmail = inviteTableResult.data.email;
          const invitedRole = inviteTableResult.data.role ?? leagueRole;
          const invitedLeagueName = leagueName ?? inviteTableResult.data.league_name;
          

          await joinLeagueAsParticipant({
            leagueId,
            profileId: data.profile_joining,
            accountId: acceptedProfile.account_id,
            roles: [invitedRole],
            contactInfo: "",
          }).unwrap();

          const inviteRemovalResult = await removeLeagueInviteByToken(token);

          if (!inviteRemovalResult.success) {
            throw inviteRemovalResult.error;
          }

          if (notificationId) {
            await deleteNotification({ notificationId }).unwrap();
          }

          await refetchNotifications();

          if (senderProfileId && invitedLeagueName && acceptedProfile.username) {
            await createNotification({
              recipient_profile_id: senderProfileId,
              sender_profile_id: acceptedProfile.id,
              sender_account_id: acceptedProfile.account_id,
              entity_id: leagueId,
              type: "INVITE_ACCEPTED",
              entity_type: "league_invite",
              metadata: {
                league_name: invitedLeagueName,
                league_role: invitedRole,
                recipient_username: acceptedProfile.username,
                recipient_email: inviteEmail,
              },
            }).unwrap();
          }
        })(),
        1000,
      );

      showToast({
        usage: "success",
        message: "You’re now a participant in this League.",
      });
      closeAllModals();
      navigate(`/league/${leagueId}`);
      onSuccess?.();
    } catch {
      closeAllModals();
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question="Join League"
        helperMessage="Select a Profile of yours to join this League with."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeAllModals },
          onContinue: {
            label: "Join League",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ProfileSelectInput
          name="profile_joining"
          type="profile"
          fieldLabel="Joining League"
          isLarge
          profiles={formattedProfiles}
          hasError={!!errors.profile_joining}
          errorMessage={errors.profile_joining?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default AcceptJoinLeague;