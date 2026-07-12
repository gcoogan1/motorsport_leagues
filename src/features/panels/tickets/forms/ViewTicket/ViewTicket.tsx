import { useModal } from "@/providers/modal/useModal";
import FormModal from "@/components/Forms/FormModal/FormModal";
import Incident from "@/components/Messages/Incident/Incident";
import ResolveTicket from "../ResolveTicket/ResolveTicket";

type ViewTicketProps = {
  ticketId: string;
  seasonId: string;
  ticketNum: number;
  stewardId: string;
  eventId: string;
  seasonName: string;
  sessionType: string;
  eventName: string;
  description: string;
  createdAt: string;
  reportingDriver: {
    id: string;
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    teamName?: string;
  };
  offendingDriver: {
    id: string;
    username: string;
    avatarType: "preset" | "upload";
    avatarValue: string;
    teamName?: string;
  };
};

const ViewTicket = ({
  ticketId,
  seasonId,
  ticketNum,
  stewardId,
  eventId,
  seasonName,
  reportingDriver,
  offendingDriver,
  createdAt,
  eventName,
  description,
  sessionType,
}: ViewTicketProps) => {
  const { openModal, closeModal } = useModal();

  const handleResolve = () => {
    closeModal();
    openModal(
      <ResolveTicket
        ticketId={ticketId}
        seasonId={seasonId}
        ticketNum={ticketNum}
        stewardId={stewardId}
        eventId={eventId}
        eventName={eventName}
        sessionType={sessionType}
        offendingDriver={offendingDriver}
      />,
    );
    return;
  };

  return (
    <FormModal
      question={`View Ticket #${ticketNum}`}
      helperMessage={seasonName}
      buttons={{
        onCancel: { label: "Cancel", action: closeModal },
        onContinue: {
          label: "Resolve",
          action: handleResolve,
        },
      }}
    >
      <Incident
        reportingDriver={reportingDriver}
        offendingDriver={offendingDriver}
        eventName={eventName}
        session={sessionType}
        description={description}
        createdAt={createdAt}
      />
    </FormModal>
  );
};

export default ViewTicket;
