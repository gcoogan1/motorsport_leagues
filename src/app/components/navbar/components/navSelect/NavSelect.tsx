import React, { useState } from "react";
import Icon from "@/components/Icon/Icon";
import Dropdown from "@assets/Icon/Dropdown.svg?react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SelectLabel, SelectWrapperButton } from "./NavSelect.styles";

type NavSelectProps = {
  icon: React.ReactNode;
  label: string;
}

const NavSelectComponent = ({ icon, label }: NavSelectProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 919px)");

  return (
    <SelectWrapperButton onClick={() => setOpen(!open)} aria-expanded={open} aria-label={label}>
      {isMobile ? (
        <Icon ariaLabel={label}>{icon}</Icon>
      ) : (
        <>
          <Icon ariaLabel={label}>{icon}</Icon>
          <SelectLabel>{label}</SelectLabel>
          <Icon size="small" ariaLabel={open ? "Close menu" : "Open menu"}>
            <Dropdown />
          </Icon>
        </>
      )}
    </SelectWrapperButton>
  )
}

const NavSelect = React.memo(NavSelectComponent);

export default NavSelect;