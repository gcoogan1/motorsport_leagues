import { useSelector } from "react-redux";
// import { useModal } from "@/providers/modal/useModal";
// import { usePanel } from "@/providers/panel/usePanel";
import { selectCurrentProfile } from "@/store/profile/profile.selectors";
import LinkList from "@/components/Lists/LinkList/LinkList"
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout"
import EditIcon from "@assets/Icon/Edit.svg?react"
import ImageChange from "@assets/Icon/Image_Change.svg?react"
import DeleteIcon from "@assets/Icon/Delete.svg?react"

const ProfileEdit = () => {
  // const { openModal } = useModal();
  // const { closePanel } = usePanel();


  const profile = useSelector(selectCurrentProfile);

  if (!profile) return null;

  return (
    <PanelLayout panelTitle="Edit Profile" panelTitleIcon={<EditIcon />}>
      <LinkList 
        sectionTitle="Information"
        options={[
          {
            optionType: "text",
            optionTitle: "Avatar Image",
            optionHelper: "Change Profile’s Image",
            optionIcon: <ImageChange />,
            optionIconLabel: "Edit Avatar Icon",
            onOptionClick: () => {
              console.log("Edit Avatar Image");
            },
          },
          {
            optionType: "text",
            optionTitle: "Username",
            optionHelper: profile.username,
            optionIcon: <EditIcon />,
            optionIconLabel: "Edit Username Icon",
            onOptionClick: () => {
              console.log("Edit username");
            },
          }
        ]}
      />
      <LinkList
        sectionTitle="Management"
        options={[
          {
            optionType: "text",
            optionTitle: "Delete Profile",
            optionIcon: <DeleteIcon />,
            optionIconLabel: "Delete Profile Icon",
            onOptionClick: () => {
              console.log("Delete profile");
            },
          },
        ]}
      />
    </PanelLayout>
  )
}

export default ProfileEdit;