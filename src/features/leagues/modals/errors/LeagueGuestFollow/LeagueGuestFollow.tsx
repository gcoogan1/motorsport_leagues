import { useModal } from "@/providers/modal/useModal";
import Dialog from "@/components/Dialog/Dialog";
import { navigate } from "@/app/navigation/navigation";

type LeagueGuestFollowProps = {
  type?: "join" | "follow";
};

const LeagueGuestFollow = ({ type = "follow" }: LeagueGuestFollowProps) => {
  const { closeModal } = useModal();

  const handleContinue = () => {
    navigate("/create-account");
    closeModal();
  };

  return (
    <Dialog
      type="alert"
      title={
        type === "follow"
          ? "Account Required to Follow Leagues"
          : "Account Required to Join Leagues"
      }
      subtitle={
        type === "follow"
          ? `Please create an account or log in to follow this League.`
          : `Please create an account or log in to join this League.`
      }
      buttons={{
        onCancel: {
          label: "Cancel",
          action: () => closeModal(),
        },
        onContinue: {
          label: "Create Account",
          action: () => handleContinue(),
        },
      }}
    />
  );
};

export default LeagueGuestFollow;
