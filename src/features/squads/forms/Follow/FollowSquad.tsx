import { useState } from "react";
import { useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RootState } from "@/store";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { useFollowSquadMutation } from "@/store/rtkQueryAPI/squadApi";
import { useToast } from "@/providers/toast/useToast";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import { followSquadSchema, type FollowSquadFormValues } from "./followSquadSchema";

type FollowSquadProps = {
  accountId: string;
  squadIdToFollow: string;
};

const FollowSquad = ({ accountId, squadIdToFollow }: FollowSquadProps) => {

  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [followSquad] = useFollowSquadMutation();
  const [isLoading, setIsLoading] = useState(false);
  const profiles = useSelector((state: RootState) => state.profile.data);
  const formatedProfiles = convertProfilesToSelectOptions(profiles || []);


  // -- Form setup -- //
  const formMethods = useForm<FollowSquadFormValues>({
    resolver: zodResolver(followSquadSchema),
    defaultValues: {
      profile_following: profiles?.[0]?.id ?? "",
    },
    // Triggers validation on every change so 'errors' updates instantly
    mode: "onChange", 
  });

  const { handleSubmit, formState: { errors } } = formMethods;


  // -- Handlers -- //

  const handleOnSubmit = async (data: FollowSquadFormValues) => {
      try {
      setIsLoading(true);

      await withMinDelay(
        followSquad({
        squadId: squadIdToFollow,
        profileId: data.profile_following,
        accountId: accountId,
      }).unwrap(),
        1000,
      );

      showToast({
        usage: "success",
        message: "Now following this Squad.",
      });
      closeModal();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question="Follow Squad"
        helperMessage="Select a Profile of yours to follow this Squad with."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
          onContinue: {
            label: "Follow Squad",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ProfileSelectInput
          name="profile_following"
          type="profile"
          fieldLabel="Following Squad"
          isLarge
          profiles={formatedProfiles}
          hasError={!!errors.profile_following}
          errorMessage={errors.profile_following?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default FollowSquad;
