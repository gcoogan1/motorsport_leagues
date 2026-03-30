import { FormProvider, useForm } from "react-hook-form";
import type { ProfileTable } from "@/types/profile.types";
import { useModal } from "@/providers/modal/useModal";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import LeaveSquad from "./LeaveSquad";

type LeaveSquadProfilePickerProps = {
  squadId: string;
  profiles: ProfileTable[];
  /** Pre-selects the active profile if it is one of the member profiles. */
  activeProfileId?: string;
};

type LeaveSquadProfilePickerForm = {
  profileId: string;
};

const LeaveSquadProfilePicker = ({
  squadId,
  profiles,
  activeProfileId,
}: LeaveSquadProfilePickerProps) => {
  const { openModal, closeModal } = useModal();

  const defaultProfileId =
    activeProfileId && profiles.some((p) => p.id === activeProfileId)
      ? activeProfileId
      : (profiles[0]?.id ?? "");

  const formMethods = useForm<LeaveSquadProfilePickerForm>({
    defaultValues: { profileId: defaultProfileId },
  });

  const profileOptions = convertProfilesToSelectOptions(profiles);

  const handleContinue = () => {
    const selectedProfileId = formMethods.getValues("profileId");

    if (!selectedProfileId) {
      return;
    }

    closeModal();
    openModal(<LeaveSquad squadId={squadId} profileId={selectedProfileId} />);
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question="Choose Profile"
        helperMessage="Select which profile should leave this Squad."
        buttons={{
          onCancel: {
            label: "Cancel",
            action: closeModal,
          },
          onContinue: {
            label: "Continue",
            action: handleContinue,
          },
        }}
      >
        <ProfileSelectInput
          name="profileId"
          fieldLabel="Select Your Profile"
          type="profile"
          profiles={profileOptions}
          placeholder="Select profile..."
        />
      </FormModal>
    </FormProvider>
  );
};

export default LeaveSquadProfilePicker;
