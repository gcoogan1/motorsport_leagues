import { useModal } from "@/providers/modal/useModal";
import Dialog from "@/components/Dialog/Dialog";
import { navigate } from "@/app/navigation/navigation";

type LeagueNoProfileProps = {
  type?: "join" | "follow";
};

const LeagueNoProfile = ({ type = "follow" }: LeagueNoProfileProps) => {
  const { closeModal, closeAllModals } = useModal();

  const handleContinue = () => {
    closeAllModals();
    navigate("/create-profile");
  };

  return (
    <Dialog
      type="core"
      title={
        type === "follow"
          ? "Profile Required to Follow Leagues"
          : "Profile Required to Join Leagues"
      }
      subtitle={
        type === "follow"
          ? `Please create a Profile to be able to follow this, and other, Leagues.`
          : `Please create a Profile to be able to join this, and other, Leagues.`
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

export default LeagueNoProfile;