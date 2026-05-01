import FormModal from "@/components/Forms/FormModal/FormModal";
import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import { useModal } from "@/providers/modal/useModal";
import type { GameType } from "@/types/profile.types";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";

type ContactInfoProps = {
  profile: {
    username: string;
    avatarType: "preset" | "upload";
    gameType: GameType;
    avatarValue: string;
  };
  contactInfo: string;
};

const ContactInfo = ({ profile, contactInfo }: ContactInfoProps) => {
  const { closeModal } = useModal();
  const gameType = convertGameTypeToFullName(profile.gameType);

  return (
    <FormModal
      question="Contact Info"
      helperMessage="Information provided by the user as a contact method."
      buttons={{
        onContinue: {
          label: "Close",
          action: closeModal,
        },
      }}
    >
      <ReadOnlyInput
        label="Profile"
        profile={{
          username: profile.username,
          information: gameType,
          avatarType: profile.avatarType,
          avatarValue: profile.avatarValue,
          size: "medium",
        }}
      />
      <ReadOnlyInput label="Contact" textValue={contactInfo} />
    </FormModal>
  );
};

export default ContactInfo;