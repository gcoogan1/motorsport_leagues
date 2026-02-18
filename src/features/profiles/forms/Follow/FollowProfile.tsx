import { useState } from "react";
import { useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RootState } from "@/store";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { useFollowProfileMutation } from "@/store/rtkQueryAPI/profileApi";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import { followProfileSchema, type FollowProfileFormValues } from "./followProfileSchema";
import { withMinDelay } from "@/utils/withMinDelay";

type FollowProfileProps = {
  userId: string;
  profileIdToFollow: string;
};

const FollowProfile = ({ userId, profileIdToFollow }: FollowProfileProps) => {

  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [followProfile] = useFollowProfileMutation();
  const [isLoading, setIsLoading] = useState(false);
  const profiles = useSelector((state: RootState) => state.profile.data);
  const formatedProfiles = convertProfilesToSelectOptions(profiles || []);


  // -- Form setup -- //
  const formMethods = useForm<FollowProfileFormValues>({
    resolver: zodResolver(followProfileSchema),
    defaultValues: {
      follow_profile: "",
    },
    // Triggers validation on every change so 'errors' updates instantly
    mode: "onChange", 
  });

  const { handleSubmit, formState: { errors } } = formMethods;


  // -- Handlers -- //

  const handleOnSubmit = async (data: FollowProfileFormValues) => {
      try {
      setIsLoading(true);

      await withMinDelay(
        followProfile({
        userId: userId,
        followerProfileId: data.follow_profile,
        followingProfileId: profileIdToFollow,
      }).unwrap(),
        1000,
      );

      showToast({
        usage: "success",
        message: "Now following Profile.",
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
        question="Select a Profile of yours to follow this Profile with."
        onSubmit={handleSubmit(handleOnSubmit)}
        buttons={{
          onCancel: { label: "Cancel", action: closeModal },
          onContinue: {
            label: "Follow Profile",
            loading: isLoading,
            loadingText: "Loading...",
          },
        }}
      >
        <ProfileSelectInput
          name="follow_profile"
          type="profile"
          fieldLabel="Select a profile to follow"
          isLarge
          profiles={formatedProfiles}
          hasError={!!errors.follow_profile}
          errorMessage={errors.follow_profile?.message}
        />
      </FormModal>
    </FormProvider>
  );
};

export default FollowProfile;
