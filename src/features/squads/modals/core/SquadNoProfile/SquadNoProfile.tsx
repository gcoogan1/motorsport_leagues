import { useModal } from "@/providers/modal/useModal";
import Dialog from "@/components/Dialog/Dialog";
import { navigate } from "@/app/navigation/navigation";

type SquadNoProfileProps = {
  type?: "join" | "follow";
};

const SquadNoProfile = ({ type = "follow" }: SquadNoProfileProps) => {
  const { closeModal } = useModal();

  const handleContinue = () => {
    navigate("/create-profile");
    closeModal();
  };

  return (
    <Dialog
      type="core"
      title={
        type === "follow"
          ? "Profile Required to Follow Squads"
          : "Profile Required to Join Squads"
      }
      subtitle={
        type === "follow"
          ? `Please create a Profile to be able to follow this, and other, Squads.`
          : `Please create a Profile to be able to join this, and other, Squads.`
      }
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Create Profile",
          action: () => handleContinue(),
        },
      }}
    />
  );
};

export default SquadNoProfile;