import { useState } from "react";
import { useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RootState } from "@/store";
import { useModal } from "@/providers/modal/useModal";
import { withMinDelay } from "@/utils/withMinDelay";
import { useFollowLeagueMutation } from "@/rtkQuery/API/leagueApi";
import { useToast } from "@/providers/toast/useToast";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import { followLeagueSchema, type FollowLeagueFormValues } from "./followLeagueSchema";

type FollowLeagueProps = {
  accountId: string;
  leagueIdToFollow: string;
};

const FollowLeague = ({ accountId, leagueIdToFollow }: FollowLeagueProps) => {

  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [followLeague] = useFollowLeagueMutation();
  const [isLoading, setIsLoading] = useState(false);
  const profiles = useSelector((state: RootState) => state.profile.data);
  const formatedProfiles = convertProfilesToSelectOptions(profiles || []);


  // -- Form setup -- //
  const formMethods = useForm<FollowLeagueFormValues>({
    resolver: zodResolver(followLeagueSchema),
    defaultValues: {
      profile_following: profiles?.[0]?.id ?? "",
    },
    // Triggers validation on every change so 'errors' updates instantly
    mode: "onChange", 
  });

  const { handleSubmit, formState: { errors } } = formMethods;


  // -- Handlers -- //

  const handleOnSubmit = async (data: FollowLeagueFormValues) => {
      try {
      setIsLoading(true);

      await withMinDelay(
        followLeague({
        leagueId: leagueIdToFollow,
        profileId: data.profile_following,
        accountId: accountId,
      }).unwrap(),
        1000,
      );

      showToast({
        usage: "success",
        message: "Now following this League.",
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
        question="Follow League"
        helperMessage="Select a Profile of yours to follow this League with."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
          onContinue: {
            label: "Follow League",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ProfileSelectInput
          name="profile_following"
          type="profile"
          fieldLabel="Select Your Profile"
          isLarge
          profiles={formatedProfiles}
          hasError={!!errors.profile_following}
          errorMessage={errors.profile_following?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default FollowLeague;
