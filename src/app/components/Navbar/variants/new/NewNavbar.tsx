import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/providers/auth/useAuth";
import { usePanel } from "@/providers/panel/usePanel";
import type { PanelTypes } from "@/types/panel.types";
import type { UserData } from "@/types/auth.types";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import Profile from "@assets/Icon/Profile.svg?react";
import Squad from "@assets/Icon/Squad.svg?react";
import League from "@assets/Icon/League.svg?react";
import Account from "@assets/Icon/Account_Filled.svg?react";
import NavBrand from "../../components/NavBrand/NavBrand";
import NavLayout from "../../components/NavLayout/NavLayout";
import NavNotification from "../../components/NavNotification/NavNotification";
import NavAccount from "../../components/NavAccount/NavAccount";
import {
  AccountMenuContainer,
  LeftContainer,
  RightContainer,
} from "./NewNavbar.styles";

type NewNavbarProps = {
  user?: UserData;
  countNotifications?: number;
  accountLabel?: string;
};

type MenuOption = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

const NewNavbar = ({ user, countNotifications, accountLabel }: NewNavbarProps) => {
  const { loading } = useAuth();
  const { openPanel } = usePanel();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuOptions: MenuOption[] = useMemo(
    () => [
      { label: "Profiles", value: "PROFILES", icon: <Profile /> },
      { label: "Squads", value: "SQUADS", icon: <Squad /> },
      { label: "Leagues", value: "LEAGUES", icon: <League /> },
      { label: "Account", value: "ACCOUNT", icon: <Account /> },
    ],
    []
  );

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  const openPanelOfType = (type: PanelTypes) => {
    openPanel(type);
  };

  const handleMenuSelect = (value: string) => {
    openPanelOfType(value as PanelTypes);
    setIsMenuOpen(false);
  };

  return (
    <NavLayout>
      <LeftContainer>
        <NavBrand />
      </LeftContainer>
      <RightContainer>
        {user && !loading && (
          <>
            <NavNotification
              count={countNotifications}
              onClick={() => openPanelOfType("NOTIFICATIONS")}
            />
            <AccountMenuContainer ref={menuRef}>
              <NavAccount
                label={accountLabel}
                onClick={() => setIsMenuOpen((prev) => !prev)}
              />
              {isMenuOpen && (
                <MenuDropdown
                  type="text"
                  options={menuOptions}
                  onSelect={handleMenuSelect}
                  isStandAlone
                />
              )}
            </AccountMenuContainer>
          </>
        )}
      </RightContainer>
    </NavLayout>
  );
};

export default NewNavbar;