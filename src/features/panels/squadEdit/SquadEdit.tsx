import { useSelector } from "react-redux";
import { useModal } from "@/providers/modal/useModal";
import { usePanel } from "@/providers/panel/usePanel";
import type { RootState } from "@/store";
import { selectCurrentSquad } from "@/store/squads/squad.selectors";
import { useSquadMembers } from "@/rtkQuery/hooks/queries/useSquadMembers";
import { useSquadFounderContext } from "@/hooks/useSquadFounderContext";
import LinkList from "@/components/Lists/LinkList/LinkList";
import EditIcon from "@assets/Icon/Edit.svg?react";
import ImageChange from "@assets/Icon/Image_Change.svg?react";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import LeaveIcon from "@assets/Icon/Leave.svg?react";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import EditBanner from "./forms/EditBanner/EditBanner";
import EditSquadName from "./forms/EditSquadName/EditSquadName";
import CannotLeave from "./modals/error/CannotLeave/CannotLeave";
import DeleteSquad from "./forms/DeleteSquad/DeleteSquad";
import LeaveSquad from "./modals/core/LeaveSquad/LeaveSquad";

const SquadEdit = () => {
  const { openModal } = useModal();
  const { closePanel } = usePanel();

  const squad = useSelector(selectCurrentSquad);
  const currentUserProfiles = useSelector(
    (state: RootState) => state.profile.data ?? [],
  );
  const { data: squadMembers = [] } = useSquadMembers(squad?.id);

  const { isOnlyFounder, inviterFounderProfileId } = useSquadFounderContext({
    squadMembers,
    currentUserProfiles,
  });

  if (!squad) return null;

  // -- Handlers -- //
  const handleEditBanner = () => {
    openModal(<EditBanner />);
  };

  const handleEditSquadName = () => {
    openModal(<EditSquadName />);
  };

  const handleLeaveSquad = () => {
    if (isOnlyFounder) {
      // Only founder cannot leave without transfer/delete.
      openModal(<CannotLeave />);
      return;
    }

    if (!inviterFounderProfileId) return;

    // Founder is not the only founder (or viewer is not a founder).
    openModal(
      <LeaveSquad squadId={squad.id} profileId={inviterFounderProfileId} />,
    );
    return;
  };

  const handleDeleteSquad = () => {
    openModal(<DeleteSquad closePanel={closePanel} />);
  };

  return (
    <PanelLayout panelTitle="Edit Squad" panelTitleIcon={<EditIcon />}>
      <LinkList
        sectionTitle="Information"
        options={[
          {
            optionType: "text",
            optionTitle: "Banner Image",
            optionHelper: "Change Squad’s Image",
            optionIcon: <ImageChange />,
            optionIconLabel: "Edit Banner Icon",
            onOptionClick: () => {
              handleEditBanner();
            },
          },
          {
            optionType: "text",
            optionTitle: "Squad Name",
            optionHelper: squad.squad_name,
            optionIcon: <EditIcon />,
            optionIconLabel: "Edit Squad Name Icon",
            onOptionClick: () => {
              handleEditSquadName();
            },
          },
        ]}
      />
      <LinkList
        sectionTitle="Management"
        options={[
          {
            optionType: "text",
            optionTitle: "Leave Squad",
            optionIcon: <LeaveIcon />,
            optionIconLabel: "Leave Squad Icon",
            onOptionClick: () => {
              handleLeaveSquad();
            },
          },
          {
            optionType: "text",
            optionTitle: "Delete Squad",
            optionIcon: <DeleteIcon />,
            optionIconLabel: "Delete Squad Icon",
            onOptionClick: () => {
              handleDeleteSquad();
            },
          },
        ]}
      />
    </PanelLayout>
  );
};

export default SquadEdit;
