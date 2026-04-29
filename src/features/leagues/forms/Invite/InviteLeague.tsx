import { useState } from "react";
import { useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RootState } from "@/store";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { getAccountEmailById } from "@/services/account.service";
import { inviteToLeague } from "@/services/league.service";
import { useGetProfilesQuery } from "@/rtkQuery/API/profileApi";

import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import {
  LEAGUE_PARTICIPANT_ROLES,
  type EmailInvite,
  type LeagueInviteTable,
} from "@/types/league.types";
import FormModal from "@/components/Forms/FormModal/FormModal";
import MultiUserInput from "@/components/Inputs/MultiUserInput/MultiUserInput";
import { inviteSchema } from "./inviteLeagueSchema";
import { useCreateNotification } from "@/rtkQuery/hooks/mutations/useNotificationMutation";
import { useLeagueParticipants } from "@/rtkQuery/hooks/queries/useLeagues";
import { useLeagueInvites } from "@/rtkQuery/hooks/queries/useLeagueInvites";
import type { Tag } from "@/components/Tags/Tags.variants";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";

type InviteLeagueProps = {
  leagueId: string;
  leagueName: string;
  directorName: string;
  directorProfileId: string;
  directorAccountId: string;
};

const InviteLeague = ({
  leagueId,
  leagueName,
  directorName,
  directorProfileId,
  directorAccountId,
}: InviteLeagueProps) => {
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [createNotification] = useCreateNotification();

  const userId = useSelector((state: RootState) => state.account.data?.id);
  const { data: profilesData } = useGetProfilesQuery({ userId });
  const { data: leagueMembers } = useLeagueParticipants(leagueId);
  const { refetch: refetchPendingInvites } = useLeagueInvites(leagueId);

  const profiles =
    profilesData?.map((profile) => ({
      username: profile.username,
      avatarType: profile.avatar_type || "",
      avatarValue: profile.avatar_value || "",
      game: profile.game_type || "",
      id: profile.id,
      accountId: profile.account_id,
    })) ?? [];

  // Filter out profiles that are already league members or already invited
  const availableProfiles = profiles.filter(
    (profile) =>
      !leagueMembers?.some((member) => member.profile_id === profile.id),
  );

  const roleOptions = LEAGUE_PARTICIPANT_ROLES.map((role) => ({
    value: role as Tag,
    label: role.charAt(0).toUpperCase() + role.slice(1),
  }));

  // -- Form setup -- //

  const formMethods = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: { invitees: [], role: "driver" },
  });

  const { handleSubmit } = formMethods;

  // -- Handlers -- //
  const handleOnCancel = () => {
    closeModal();
  };

  const handleSendInvite = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const emails: EmailInvite[] = await Promise.all(
        data.invitees.map(async (invitee) => {
          if (invitee.isEmail) return { email: invitee.value };
          if (!invitee.accountId)
            return { email: "", profileId: invitee.profileId };
          const result = await getAccountEmailById(invitee.accountId);
          return { email: result?.email ?? "", profileId: invitee.profileId };
        }),
      );

      const res = await inviteToLeague({
        emails,
        leagueId,
        leagueName,
        role: "driver",
        senderUsername: directorName,
        senderAccountId: directorAccountId,
        senderProfileId: directorProfileId,
      });

      if (!res.success) {
        throw new Error(res.error?.message || "Failed to send invites.");
      }

      const inviteRows: LeagueInviteTable[] = Array.isArray(res.data)
        ? res.data
        : [];

      if (directorAccountId && directorProfileId) {
        await Promise.all(
          data.invitees.map(async (invitee) => {
            const matchingInvite = inviteRows.find(
              (inv) => inv.profile_id === invitee.profileId,
            );

            // If no profile, NO NOTIFICATION
            if (!invitee.profileId) return;

            // If invite token is missing, skip notification to avoid invalid payload
            if (!matchingInvite?.token) return;

            // Set receiver's profile username for notification metadata (for display purposes in the notification)
            const inviteeUsername = profiles.find(
              (p) => p.id === invitee.profileId,
            )?.username;

            // SEND NOTIFICATION
            await createNotification({
              recipient_profile_id: invitee.profileId,
              sender_account_id: directorAccountId,
              sender_profile_id: directorProfileId,
              type: "INVITE_RECEIVED",
              entity_type: "league_invite",
              entity_id: leagueId,
              metadata: {
                league_name: leagueName,
                sender_username: directorName,
                invite_token: matchingInvite.token,
                receiver_profile_username: inviteeUsername,
              },
            }).unwrap();
          }),
        );
      }
      // Update the list of pending invites to reflect the newly sent invites
      await refetchPendingInvites();

      showToast({
        usage: "success",
        message: "Invite(s) sent.",
      });
      closeModal();
      return;
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setLoading(false);
    }
  });

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question={"Invite Members"}
        helperMessage="Send an invite to join this League - to a user’s Profile or their email address."
        buttons={{
          onCancel: { label: "Cancel", action: handleOnCancel },
          onContinue: {
            label: "Send Invite",
            action: handleSendInvite,
            loading: loading,
            loadingText: "Loading...",
          },
        }}
      >
        <MultiUserInput
          name="invitees"
          label="Profiles or Emails"
          placeholder="e.g., FranzH, max@email.com"
          profiles={availableProfiles}
        />
        <SelectInput
          name="role"
          label="Role"
          options={roleOptions}
          helperText="Assign more roles to participants from the Manage League page."
        />
      </FormModal>
    </FormProvider>
  );
};

export default InviteLeague;
