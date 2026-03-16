import { useState } from "react";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import type { RootState } from "@/store";
import { useToast } from "@/providers/toast/useToast";
import { useModal } from "@/providers/modal/useModal";
import { useJoinSquadAsMember } from "@/hooks/rtkQuery/mutations/useSquadMutation";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { withMinDelay } from "@/utils/withMinDelay";
import { navigate } from "@/app/navigation/navigation";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import { joinSquadSchema, type JoinSquadFormValues } from "./acceptJoinSquad.schema";
import { removeSquadInviteByToken } from "@/services/squad.service";

type AcceptJoinSquadProps = {
  token: string;
  squadId: string;
};

const AcceptJoinSquad = ({ token, squadId }: AcceptJoinSquadProps) => {
  const { openModal, closeAllModals } = useModal();
  const { showToast } = useToast();
  const [joinSquadAsMember] = useJoinSquadAsMember();
  const [isLoading, setIsLoading] = useState(false);
  const profiles = useSelector((state: RootState) => state.profile.data);
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
            await joinSquadAsMember({
              squadId,
              profileId: data.profile_joining,
              role: "member",
            }).unwrap();

            const inviteRemovalResult = await removeSquadInviteByToken(token);

            if (!inviteRemovalResult.success) {
              throw inviteRemovalResult.error;
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