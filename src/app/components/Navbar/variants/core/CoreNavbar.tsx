import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/providers/auth/useAuth";
import { usePanel } from "@/providers/panel/usePanel";
import type { PanelTypes } from "@/types/panel.types";
import type { UserData } from "@/types/auth.types";
import Button from "@/components/Button/Button";
import Back from "@assets/Icon/Arrow_Backward.svg?react";
import NavLayout from "../../components/NavLayout/NavLayout";
import NavBrand from "../../components/NavBrand/NavBrand";
import NavAccount from "../../components/NavAccount/NavAccount";
import Squad from "@assets/Icon/Squad.svg?react";
import League from "@assets/Icon/League.svg?react";
import Account from "@assets/Icon/Account_Filled.svg?react";
import Logout from "@assets/Icon/Logout.svg?react";
import Profile from "@assets/Icon/Profile.svg?react";
import MenuDropdown from "@/components/Dropdowns/MenuDropdown/MenuDropdown";
import NavNotification from "../../components/NavNotification/NavNotification";
import {
  AccountMenuContainer,
  CenterContainer,
  LeftContainer,
  RightContainer,
} from "./CoreNavbar.styles";
import { resetAppState } from "@/store/appReset";
import type { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";

type MenuOption = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

type CoreNavbarProps = {
  user?: UserData;
  countNotifications?: number;
  accountLabel?: string;
  manualGoBack?: () => void;
};

const CoreNavbar = ({
  user,
  countNotifications,
  accountLabel,
  manualGoBack,
}: CoreNavbarProps) => {
  const { loading, resetAuth } = useAuth();
  const isMobile = useMediaQuery("(max-width: 919px)");
  const navigate = useNavigate();
  const { openPanel } = usePanel();
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuOptions: MenuOption[] = useMemo(
    () => [
      { label: "My Profiles", value: "PROFILES", icon: <Profile /> },
      { label: "My Squads", value: "SQUADS", icon: <Squad /> },
      { label: "My Leagues", value: "LEAGUES", icon: <League /> },
      { label: "Account Settings", value: "ACCOUNT", icon: <Account /> },
      { label: "Log Out", value: "LOGOUT", icon: <Logout /> },
    ],
    [],
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

  const goBackOrHome = () => {
    if (manualGoBack) {
      manualGoBack();
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const openPanelOfType = (type: PanelTypes) => {
    openPanel(type);
  };

  const handleLogout = async () => {
    try {
      await resetAuth();
      dispatch(resetAppState());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMenuSelect = async (value: string) => {
    if (value === "LOGOUT") {
      setIsMenuOpen(false);
      await handleLogout();
      return;
    }

    openPanelOfType(value as PanelTypes);
    setIsMenuOpen(false);
  };

  return (
    <NavLayout>
      <LeftContainer>
        {isMobile ? (
          <Button
            color="base"
            rounded
            icon={{ left: <Back /> }}
            onClick={goBackOrHome}
          />
        ) : (
          <Button
            color="base"
            rounded
            icon={{ left: <Back /> }}
            onClick={goBackOrHome}
          >
            Back
          </Button>
        )}
      </LeftContainer>
      <CenterContainer>
        <NavBrand />
      </CenterContainer>
      <RightContainer>
        {user && !loading && (
          <>
            <NavNotification
              count={countNotifications}
              onClick={() => openPanelOfType("NOTIFICATIONS")}
            />

            {!!accountLabel && (
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
            )}
          </>
        )}
      </RightContainer>
    </NavLayout>
  );
};

export default CoreNavbar;
