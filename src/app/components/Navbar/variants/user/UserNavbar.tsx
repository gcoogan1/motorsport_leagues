import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useIsWrapped } from "@/hooks/useIsWrapped";
import { useAuth } from "@/providers/auth/useAuth";
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
import { usePanel } from "@/providers/panel/PanelProvider";

//TODO: Add onClick handlers to NavSelects and NavAccount

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

  const openAccountPanel = () => {
    openPanel("ACCOUNT");
  }

  return (
    <NavLayout ref={ref}>
      <LeftContainer $isWrapped={isWrapped}>
        <NavBrand />
      </LeftContainer>
      {!isMobile ? (
        <>
          <CenterContainer>
            <>
              <NavSelect icon={<Profile />} label={"Profiles"} />
              <NavSelect icon={<Squad />} label={"Squads"} />
              <NavSelect icon={<League />} label={"Leagues"} />
            </>
          </CenterContainer>
          <RightContainer>
            {(user && !loading) && (
              <>
                {!!countNotifications && (
                  <NavNotification count={countNotifications} />
                )}
                {!!accountLabel && <NavAccount label={accountLabel} onClick={openAccountPanel} />}
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
              {(user && !loading) && (
                <>
                  {!!countNotifications && (
                    <NavNotification count={countNotifications} />
                  )}
                  {!!accountLabel && <NavAccount label={accountLabel} onClick={openAccountPanel} />}
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
