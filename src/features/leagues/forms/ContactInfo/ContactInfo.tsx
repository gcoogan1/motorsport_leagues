import FormModal from "@/components/Forms/FormModal/FormModal";
import ReadOnlyInput from "@/components/Inputs/ReadOnlyInput/ReadOnlyInput";
import { useModal } from "@/providers/modal/useModal";

type ContactInfoProps = {
  profile: {
    username: string;
    avatarType: "preset" | "upload";
    gameType: string;
    avatarValue: string;
  };
  contactInfo: string;
};

const ContactInfo = ({ profile, contactInfo }: ContactInfoProps) => {
  const { closeModal } = useModal();

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
          information: profile.gameType,
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