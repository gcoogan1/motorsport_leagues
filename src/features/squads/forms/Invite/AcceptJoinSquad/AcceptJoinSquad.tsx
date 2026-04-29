import { useState } from "react";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import type { RootState } from "@/store";
import { useToast } from "@/providers/toast/useToast";
import { useModal } from "@/providers/modal/useModal";
import { useJoinSquadAsMember } from "@/rtkQuery/hooks/mutations/useSquadMutation";
import { useCreateNotification, useDeleteNotification } from "@/rtkQuery/hooks/mutations/useNotificationMutation";
import { useAllNotifications } from "@/rtkQuery/hooks/queries/useNotifications";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { navigate } from "@/app/navigation/navigation";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import { joinSquadSchema, type JoinSquadFormValues } from "./acceptJoinSquad.schema";
import { removeSquadInviteByToken } from "@/services/squad.service";

/*
  This component is rendered when a user clicks "Join Squad" from a squad invite notification but doesn't have a profile selected yet (edge case of the main JoinSquad flow). 
  It prompts the user to select a profile to join the squad with, then proceeds with the joining flow similarly to JoinSquad.
*/

type AcceptJoinSquadProps = {
  token: string;
  squadId: string;
  onSuccess?: () => void;
  senderAccountId?: string;
  senderProfileId?: string;
  squadName?: string;
  notificationId?: string;
};

const AcceptJoinSquad = ({
  token,
  squadId,
  onSuccess,
  senderProfileId,
  squadName,
  notificationId,
}: AcceptJoinSquadProps) => {
  const { openModal, closeAllModals } = useModal();
  const { showToast } = useToast();
  const [joinSquadAsMember] = useJoinSquadAsMember();
  const [createNotification] = useCreateNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteNotification] = useDeleteNotification();
  const profiles = useSelector((state: RootState) => state.profile.data);
  const account = useSelector((state: RootState) => state.account.data);
  const myProfileIds = profiles?.map((profile) => profile.id) ?? [];
  const { refetch: refetchNotifications } = useAllNotifications(myProfileIds);
  const formatedProfiles = convertProfilesToSelectOptions(profiles || []);

    // -- Form setup -- //
    const formMethods = useForm<JoinSquadFormValues>({
      resolver: zodResolver(joinSquadSchema),
      defaultValues: {
        profile_joining: profiles?.[0]?.id ?? "",
      },
      // Triggers validation on every change so 'errors' updates instantly
      mode: "onChange", 
    });
  
    const { handleSubmit, formState: { errors } } = formMethods;
  
  
    // -- Handlers -- //
  
    const handleOnSubmit = async (data: JoinSquadFormValues) => {
      try {
        setIsLoading(true);

        await withMinDelay(
          (async () => {
            // ACCEPT THE INVITE AND JOIN THE SQUAD AS A MEMBER WITH THE SELECTED PROFILE
            await joinSquadAsMember({
              squadId,
              profileId: data.profile_joining,
              role: "member",
            }).unwrap();

            // REMOVE INVITE TOKEN
            const inviteRemovalResult = await removeSquadInviteByToken(token);

            if (!inviteRemovalResult.success) {
              throw inviteRemovalResult.error;
            }

            // DELETE NOTIFICATION -> IF APPLICABLE
            if (notificationId)  {
                await deleteNotification({
                  notificationId,
                }).unwrap();
              }

            // REFETCH NOTIFICATIONS TO UPDATE UI
            await refetchNotifications();

            const acceptedProfile = profiles?.find(
              (profile) => profile.id === data.profile_joining,
            );

            // SEND ACCEPT NOTIFICATION TO INVITER (SENDER) IF APPLICABLE
            if (
              senderProfileId &&
              squadName &&
              acceptedProfile?.username
            ) {
              await createNotification({
                recipient_profile_id: senderProfileId,  // Founder profile ID (inviter)
                sender_profile_id: acceptedProfile.id, // Profile ID of the user who accepted the invite (invitee)
                sender_account_id: acceptedProfile.account_id, // Account ID of the user who accepted the invite (invitee)
                entity_id: squadId,
                type: "INVITE_ACCEPTED",
                entity_type: "squad_invite",
                metadata: {
                  squad_name: squadName,
                  recipient_username: acceptedProfile.username,
                  recipient_email: account?.email,
                },
              }).unwrap();
            }
          })(),
          1000,
        );

        showToast({
          usage: "success",
          message: "You’re now a member of this Squad.",
        });
        closeAllModals();
        navigate(`/squad/${squadId}`);
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
            question="Join Squad"
            helperMessage="Select a Profile of yours to join this Squad with."
            onSubmit={handleSubmit(handleOnSubmit)}
            buttons={{
              onCancel: { label: "Cancel", action: closeAllModals },
              onContinue: {
                label: "Join Squad",
                loading: isLoading,
                loadingText: "Loading...",
              },
            }}
          >
            <ProfileSelectInput
              name="profile_joining"
              type="profile"
              fieldLabel="Joining Squad"
              isLarge
              profiles={formatedProfiles}
              hasError={!!errors.profile_joining}
              errorMessage={errors.profile_joining?.message}
            />
          </FormModal>
        </FormProvider>
  )
}

export default AcceptJoinSquad