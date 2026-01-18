import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useIsWrapped } from "@/hooks/useIsWrapped";
import { useAuth } from "@/providers/auth/useAuth";
import { usePanel } from "@/providers/panel/usePanel";
import type { PanelTypes } from "@/types/panel.types";
import type { UserData } from "@/types/auth.types";
import Profile from "@assets/Icon/Profile.svg?react";
import Squad from "@assets/Icon/Squad.svg?react";
import League from "@assets/Icon/League.svg?react";
import NavBrand from "../../components/NavBrand/NavBrand";
import NavSelect from "../../components/NavSelect/NavSelect";
import NavLayout from "../../components/NavLayout/NavLayout";
import NavNotification from "../../components/NavNotification/NavNotification";
import NavAccount from "../../components/NavAccount/NavAccount";
import {
  CenterContainer,
  LeftContainer,
  MobileRightContainer,
  RightContainer,
} from "./UserNavbar.styles";

type UserNavbarProps = {
  user?: UserData;
  countNotifications?: number;
  accountLabel?: string;
};

const UserNavbar = ({
  user,
  countNotifications,
  accountLabel,
}: UserNavbarProps) => {
  const { loading } = useAuth();
  const { openPanel } = usePanel();
  const isMobile = useMediaQuery("(max-width: 919px)");
  const [ref, isWrapped] = useIsWrapped<HTMLDivElement>(150);

  const openPanelOfType = (type: PanelTypes) => {
    openPanel(type);
  };

  return (
    <NavLayout ref={ref}>
      <LeftContainer $isWrapped={isWrapped}>
        <NavBrand />
      </LeftContainer>
      {!isMobile ? (
        <>
          <CenterContainer>
            <>
              <NavSelect
                icon={<Profile />}
                label={"Profiles"}
                onClick={() => openPanelOfType("PROFILES")}
              />
              <NavSelect
                icon={<Squad />}
                label={"Squads"}
                onClick={() => openPanelOfType("SQUADS")}
              />
              <NavSelect
                icon={<League />}
                label={"Leagues"}
                onClick={() => openPanelOfType("LEAGUES")}
              />
            </>
          </CenterContainer>
          <RightContainer>
            {user && !loading && (
              <>
                <NavNotification
                  count={countNotifications}
                  onClick={() => openPanelOfType("NOTIFICATIONS")}
                />
                <NavAccount
                  label={accountLabel}
                  onClick={() => openPanelOfType("ACCOUNT")}
                />
              </>
            )}
          </RightContainer>
        </>
      ) : (
        <MobileRightContainer>
          <CenterContainer>
            <>
              <NavSelect icon={<Profile />} label={"Profiles"} />
              <NavSelect icon={<Squad />} label={"Squads"} />
              <NavSelect icon={<League />} label={"Leagues"} />
            </>
          </CenterContainer>
          <RightContainer>
            <>
              {user && !loading && (
                <>
                  <NavNotification
                    count={countNotifications}
                    onClick={() => openPanelOfType("NOTIFICATIONS")}
                  />
                  <NavAccount
                    label={accountLabel}
                    onClick={() => openPanelOfType("ACCOUNT")}
                  />
                </>
              )}
            </>
          </RightContainer>
        </MobileRightContainer>
      )}
    </NavLayout>
  );
};

export default UserNavbar;
