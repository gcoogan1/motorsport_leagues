import AccountIcon from "@assets/Icon/Account_Filled.svg?react";
import EditIcon from "@assets/Icon/Edit.svg?react";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import LogoutIcon from "@assets/Icon/Logout.svg?react";
import PanelLayout from "../../components/PanelLayout/PanelLayout";
import PanelSection from "../../components/PanelSection/PanelSection";

/*TODO: 
  - Add user data
  - Implement edit functionality
  - Implement delete account functionality
  - Implement logout functionality
*/

const AccountPanel = () => {
  return (
    <PanelLayout panelTitle="Account" panelTitleIcon={<AccountIcon />}>
      <PanelSection
        sectionTitle="Information"
        options={[
          {
            optionType: "text",
            optionTitle: "Name",
            optionHelper: "Firstname Lastname",
            optionIcon: <EditIcon />,
            optionIconLabel: "Edit Fullname Icon",
            onOptionClick: () => {
              console.log("Edit Fullname Clicked");
            },
          },
        ]}
      />
      <PanelSection
        sectionTitle="Authentication"
        options={[
          {
            optionType: "text",
            optionTitle: "Email",
            optionHelper: "email@example.com",
            optionIcon: <EditIcon />,
            optionIconLabel: "Edit Email Icon",
            onOptionClick: () => {
              console.log("Edit Email Clicked");
            },
          },
          {
            optionType: "text",
            optionTitle: "Password",
            optionHelper: "********",
            optionIcon: <EditIcon />,
            optionIconLabel: "Edit Password Icon",
            onOptionClick: () => {
              console.log("Edit Password Clicked");
            },
          },
        ]}
      />
      <PanelSection
        sectionTitle="Management"
        options={[
          {
            optionType: "text",
            optionTitle: "Delete Account",
            optionHelper: "Permanntly Delete All Data",
            optionIcon: <DeleteIcon />,
            optionIconLabel: "Delete Account Icon",
            onOptionClick: () => console.log("Delete Account Clicked"),
          },
        ]}
      />
      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
        <PanelSection
          options={[
            {
              optionType: "text",
              optionTitle: "Log Out",
              optionHelper: "See You Later!",
              optionIcon: <LogoutIcon />,
              optionIconLabel: "Log Out Icon",
              onOptionClick: () => console.log("Log Out Clicked"),
            },
          ]}
        />
      </div>
    </PanelLayout>
  );
};

export default AccountPanel;
