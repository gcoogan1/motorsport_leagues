import { useModal } from "@/providers/modal/useModal";
import Dialog from "@/components/Dialog/Dialog";
import { navigate } from "@/app/navigation/navigation";

type HostSquadProps = {
  squadName: string;
  squadId: string;
};

const HostSquad = ({ squadName, squadId }: HostSquadProps) => {
  const { closeModal } = useModal();

  const handleViewSquad = () => {
    closeModal();
    navigate(`/squad/${squadId}`);
  };

  return (
    <Dialog
      type="core"
      title={"Host"}
      subtitle={`This League is hosted by ${squadName}.`}
      buttons={{
        onCancel: {
          label: "Close",
          action: () => closeModal(),
        },
        onContinue: {
          label: "View Squad",
          action: () => {
            handleViewSquad();
          },
        },
      }}
    />
  );
};

export default HostSquad;
