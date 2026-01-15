import React, { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Account from "@assets/Icon/Account_Filled.svg?react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AccountWrapperButton, SelectLabel } from "./NavAccount.styles";

type NavAccountProps = {
  label?: string;
  onClick?: () => void;
};

const NavAccountComponent = ({ label = "Account", onClick }: NavAccountProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 919px)");

  const handleClick = () => {
    if (onClick) {
      onClick();
    } 
    setOpen(!open);
  }

  return (
    <AccountWrapperButton
      onClick={handleClick}
      aria-expanded={open}
      aria-label={"account menu"}
    >
      {isMobile ? (
        <Icon ariaLabel={"account menu"}>
          <Account />
        </Icon>
      ) : (
        <>
          <Icon ariaLabel={"account menu"}>
            <Account />
          </Icon>
          <SelectLabel>{label}</SelectLabel>
        </>
      )}
    </AccountWrapperButton>
  );
};
const NavAccount = React.memo(NavAccountComponent);

export default NavAccount;
