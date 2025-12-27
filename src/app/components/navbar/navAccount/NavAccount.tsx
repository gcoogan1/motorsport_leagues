import { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Account from "@assets/Icon/Account_Filled.svg?react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { AccountWrapperButton, SelectLabel } from "./NavAccount.styles";

type NavAccountProps = {
  label?: string;
};

const NavAccount = ({ label = "Account" }: NavAccountProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 919px)");

  return (
    <AccountWrapperButton onClick={() => setOpen(!open)} aria-expanded={open} aria-label={'account menu'}>
      {isMobile ? (
        <Icon ariaLabel={'account menu'}>
          <Account />
        </Icon>
      ) : (
        <>
          <Icon ariaLabel={'account menu'}><Account /></Icon>
          <SelectLabel>{label}</SelectLabel>
        </>
      )}
    </AccountWrapperButton>
  )
}

export default NavAccount;