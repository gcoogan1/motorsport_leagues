import React, { useState } from "react";
import Icon from "@/components/Icon/Icon";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SelectLabel, SelectWrapperButton } from "./NavSelect.styles";

type NavSelectProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavSelectComponent = ({ icon, label, onClick }: NavSelectProps) => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 919px)");

  const handleClick = () => {
    setOpen(!open);
    if (onClick) {
      onClick();
    }
  }

  return (
    <SelectWrapperButton onClick={handleClick} aria-expanded={open} aria-label={label}>
      {isMobile ? (
        <Icon ariaLabel={label}>{icon}</Icon>
      ) : (
        <>
          <Icon ariaLabel={label}>{icon}</Icon>
          <SelectLabel>{label}</SelectLabel>
        </>
      )}
    </SelectWrapperButton>
  )
}

const NavSelect = React.memo(NavSelectComponent);

export default NavSelect;