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
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { type EmailInvite } from "@/types/squad.types";
import FormModal from "@/components/Forms/FormModal/FormModal";
import MultiUserInput from "@/components/Inputs/MultiUserInput/MultiUserInput";
import { inviteSchema } from "./inviteSquadSchema";

type InviteSquadProps = {
  squadId: string;
  squadName: string;
  founderName: string;
};

const InviteSquad = ({ squadId, squadName, founderName }: InviteSquadProps) => {
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state: RootState) => state.account.data?.id);
  const { data: profilesData } = useGetProfilesQuery({ userId });

  const profiles =
    profilesData?.map((profile) => ({
      username: profile.username,
      avatarType: profile.avatar_type || "",
      avatarValue: profile.avatar_value || "",
      game: profile.game_type || "",
      id: profile.id,
      accountId: profile.account_id,
    })) ?? [];

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

      await inviteToSquad({
        emails,
        squadId,
        squadName,
        inviteeUsername: founderName,
      });
      showToast({
        usage: "success",
        message: "Invite(s) sent.",
      });
      closeModal();
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
          profiles={profiles}
        />
      </FormModal>
    </FormProvider>
  );
};

export default InviteSquad;
