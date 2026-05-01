import { FormProvider, useForm } from "react-hook-form";
import type { ProfileTable } from "@/types/profile.types";
import { useModal } from "@/providers/modal/useModal";
import { convertProfilesToSelectOptions } from "@/utils/convertProfilesToSelectOptions";
import FormModal from "@/components/Forms/FormModal/FormModal";
import ProfileSelectInput from "@/components/Inputs/ProfileSelectInput/ProfileSelectInput";
import NoDirector from "@/features/leagues/modals/errors/NoDirector/NoDirector";
import LeaveLeague from "./LeaveLeague";

type LeaveLeagueProfilePickerProps = {
  leagueId: string;
  profiles: ProfileTable[];
  participants: {
    profileId: string;
    roles: string[];
  }[];
  activeProfileId?: string;
};

type LeaveLeagueProfilePickerForm = {
  profileId: string;
};

const LeaveLeagueProfilePicker = ({
  leagueId,
  profiles,
  participants,
  activeProfileId,
}: LeaveLeagueProfilePickerProps) => {
  const { openModal, closeModal } = useModal();

  const defaultProfileId =
    activeProfileId && profiles.some((profile) => profile.id === activeProfileId)
      ? activeProfileId
      : (profiles[0]?.id ?? "");

  const formMethods = useForm<LeaveLeagueProfilePickerForm>({
    defaultValues: { profileId: defaultProfileId },
  });

  const profileOptions = convertProfilesToSelectOptions(profiles);
  const directorCount = participants.filter((participant) =>
    participant.roles.includes("director"),
  ).length;

  const handleContinue = () => {
    const selectedProfileId = formMethods.getValues("profileId");

    if (!selectedProfileId) {
      return;
    }

    const selectedParticipant = participants.find(
      (participant) => participant.profileId === selectedProfileId,
    );

    // Should never happen since the profile select options are derived from the participants, but check just in case
    if (
      selectedParticipant?.roles.includes("director") &&
      directorCount === 1
    ) {
      closeModal();
      openModal(<NoDirector removeAttempt={true} />);
      return;
    }

    closeModal();
    openModal(<LeaveLeague leagueId={leagueId} profileId={selectedProfileId} />);
  };

  return (
    <FormProvider {...formMethods}>
      <FormModal
        question="Choose Profile"
        helperMessage="Select which profile should leave this League."
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

export default LeaveLeagueProfilePicker;
