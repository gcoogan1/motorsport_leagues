import { useSelector } from "react-redux";
// import { useModal } from "@/providers/modal/useModal";
// import { usePanel } from "@/providers/panel/usePanel";
import { selectCurrentSquad } from "@/store/squads/squad.selectors";
import LinkList from "@/components/Lists/LinkList/LinkList";
import EditIcon from "@assets/Icon/Edit.svg?react";
import ImageChange from "@assets/Icon/Image_Change.svg?react";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import LeaveIcon from "@assets/Icon/Leave.svg?react";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";

const SquadEdit = () => {
  // const { openModal } = useModal();
  // const { closePanel } = usePanel();

  const squad = useSelector(selectCurrentSquad);

  if (!squad) return null;

  // -- Handlers -- //
  const handleEditBanner = () => {};

  const handleEditSquadName = () => {};

  const handleLeaveSquad = () => {};

  const handleDeleteSquad = () => {};

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
