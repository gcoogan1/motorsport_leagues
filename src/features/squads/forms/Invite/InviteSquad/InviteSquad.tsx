import { useState } from "react";
import { useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RootState } from "@/store";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { getAccountEmailById } from "@/services/account.service";
import { inviteToSquad } from "@/services/squad.service";
import { useGetProfilesQuery } from "@/store/rtkQueryAPI/profileApi";
import { useSquadMembers } from "@/hooks/rtkQuery/queries/useSquadMembers";
import { useSquadInvites } from "@/hooks/rtkQuery/queries/useSquadInvites";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { type EmailInvite, type SquadInviteTable } from "@/types/squad.types";
import FormModal from "@/components/Forms/FormModal/FormModal";
import MultiUserInput from "@/components/Inputs/MultiUserInput/MultiUserInput";
import { inviteSchema } from "./inviteSquadSchema";
import { useCreateNotification } from "@/hooks/rtkQuery/mutations/useNotificationMutation";

type InviteSquadProps = {
  squadId: string;
  squadName: string;
  founderName: string;
  founderProfileId: string;
  founderAccountId: string;
};

const InviteSquad = ({ squadId, squadName, founderName, founderProfileId, founderAccountId }: InviteSquadProps) => {
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [createNotification] = useCreateNotification();

  const userId = useSelector((state: RootState) => state.account.data?.id);
  const { data: profilesData } = useGetProfilesQuery({ userId });
  const { data: squadMembers } = useSquadMembers(squadId);
  const { data: pendingInvites } = useSquadInvites(squadId);


  const profiles =
    profilesData?.map((profile) => ({
      username: profile.username,
      avatarType: profile.avatar_type || "",
      avatarValue: profile.avatar_value || "",
      game: profile.game_type || "",
      id: profile.id,
      accountId: profile.account_id,
    })) ?? [];

  // Filter out profiles that are already squad members or already invited
  const availableProfiles = profiles.filter(
    (profile) =>
      !squadMembers?.some((member) => member.profile_id === profile.id) &&
      !pendingInvites?.some((invite) => invite.profile_id === profile.id)
  );

  // -- Form setup -- //

  const formMethods = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: { invitees: [] },
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

      const res = await inviteToSquad({
        emails,
        squadId,
        squadName,
        senderUsername: founderName,
        senderAccountId: founderAccountId,
        senderProfileId: founderProfileId,
      });

      if (!res.success) {
        throw new Error(res.error?.message || "Failed to send invites.");
      }

      const inviteRows: SquadInviteTable[] = Array.isArray(res.data)
        ? res.data
        : [];

      if (founderAccountId && founderProfileId) {
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
            const inviteeUsername = profiles.find((p) => p.id === invitee.profileId)?.username;

            // SEND NOTIFICATION
            await createNotification({
              recipient_profile_id: invitee.profileId,
              sender_account_id: founderAccountId,
              sender_profile_id: founderProfileId,
              type: "INVITE_RECEIVED",
              entity_type: "squad_invite",
              entity_id: squadId,
              metadata: {
                squad_name: squadName,
                sender_username: founderName,
                invite_token: matchingInvite.token,
                receiver_profile_username: inviteeUsername,
              },
            }).unwrap();
          }),
        );
      }

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
        helperMessage="Send an invite to join this Squad - to a user’s Profile or their email address."
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
      </FormModal>
    </FormProvider>
  );
};

export default InviteSquad;
