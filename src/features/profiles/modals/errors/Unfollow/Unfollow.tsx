import { useState } from "react";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useUnfollowProfileMutation } from "@/store/rtkQueryAPI/profileApi";
import Dialog from "@/components/Dialog/Dialog";

type UnfollowProps = {
  userId: string;
  profileId: string;
};

const Unfollow = ({ userId, profileId }: UnfollowProps) => {
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [unfollowProfile] = useUnfollowProfileMutation();

  const handleUnfollow = async () => {
    try {
      setIsLoading(true);

      await withMinDelay(
        unfollowProfile({
          userId: userId,
          followingProfileId: profileId,
        }).unwrap(),
        1000,
      );

      showToast({
        usage: "success",
        message: "No longer following this Profile.",
      });
      closeModal();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      type="alert"
      title="Unfollow Profile"
      subtitle="Are you sure you want to unfollow this Profile?"
      buttons={{
        onCancel: { label: "Cancel", action: () => closeModal() },
        onContinue: {
          label: "Unfollow Profile",
          action: () => handleUnfollow(),
          loading: isLoading,
          isDanger: true,
          loadingText: "Loading...",
        },
      }}
    />
  );
};

export default Unfollow;
