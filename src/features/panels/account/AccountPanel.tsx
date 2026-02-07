import { useSelector } from "react-redux";
import AccountIcon from "@assets/Icon/Account_Filled.svg?react";
import EditIcon from "@assets/Icon/Edit.svg?react";
import DeleteIcon from "@assets/Icon/Delete.svg?react";
import LogoutIcon from "@assets/Icon/Logout.svg?react";
import LinkList from "@/components/Lists/LinkList/LinkList";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import type { RootState } from "@/store";
import { logoutUser } from "@/services/auth.service";
import { navigate } from "@/app/navigation/navigation";
import { usePanel } from "@/providers/panel/usePanel";
import { useModal } from "@/providers/modal/useModal";
import { capitalizeString } from "@/utils/capitalizeString";
import UpdateName from "./forms/UpdateName/UpdateName";
import ChangeEmail from "./forms/ChangeEmail/ChangeEmail";
import ChangePassword from "./forms/ChangePassword/ChangePassword";
import DeleteAccount from "./forms/DeleteAccount/DeleteAccount";

/*TODO: 
  - Add functionality for when !account exists
*/

const AccountPanel = () => {
  const { openModal } = useModal();
  const { closePanel } = usePanel();

  const account = useSelector((state: RootState) => state.account.data);

  if (!account) return null;

  const fullName = `${capitalizeString(account.firstName)} ${capitalizeString(account.lastName)}`;

  // -- Handlers -- //
  const handleLogout = async () => {
    try {
      closePanel();
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <PanelLayout panelTitle="Account" panelTitleIcon={<AccountIcon />}>
      <LinkList
        sectionTitle="Information"
        options={[
          {
            optionType: "text",
            optionTitle: "Name",
            optionHelper: fullName,
            optionIcon: <EditIcon />,
            optionIconLabel: "Edit Fullname Icon",
            onOptionClick: () => {
              openModal(<UpdateName account={account} />);
            },
          },
        ]}
      />
      <LinkList
        sectionTitle="Authentication"
        options={[
          {
            optionType: "text",
            optionTitle: "Email",
            optionHelper: account.email,
            optionIcon: <EditIcon />,
            optionIconLabel: "Edit Email Icon",
            onOptionClick: () => {openModal(<ChangeEmail account={account} />);},
          },
          {
            optionType: "text",
            optionTitle: "Password",
            optionHelper: "********",
            optionIcon: <EditIcon />,
            optionIconLabel: "Edit Password Icon",
            onOptionClick: () => {
              openModal(<ChangePassword account={account} />);
            },
          },
        ]}
      />
      <LinkList
        sectionTitle="Management"
        options={[
          {
            optionType: "text",
            optionTitle: "Delete Account",
            optionIcon: <DeleteIcon />,
            optionIconLabel: "Delete Account Icon",
            onOptionClick: () => {
              openModal(<DeleteAccount account={account} closePanel={closePanel} />);
            },
          },
        ]}
      />
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <LinkList
          options={[
            {
              optionType: "text",
              optionTitle: "Log Out",
              optionHelper: "See You Later!",
              optionIcon: <LogoutIcon />,
              optionIconLabel: "Log Out Icon",
              onOptionClick: handleLogout,
            },
          ]}
        />
      </div>
    </PanelLayout>
  );
};

export default AccountPanel;
