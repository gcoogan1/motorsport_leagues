import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useIsWrapped } from "@/hooks/useIsWrapped";
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

//TODO: Add onClick handlers to NavSelects and NavAccount

type UserNavbarProps = {
  user: UserData;
  countNotifications?: number;
  accountLabel?: string;
};

const UserNavbar = ({
  user,
  countNotifications,
  accountLabel,
}: UserNavbarProps) => {
  const isMobile = useMediaQuery("(max-width: 919px)");
  const [ref, isWrapped] = useIsWrapped<HTMLDivElement>(150);

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
            {user && (
              <>
                {!!countNotifications && (
                  <NavNotification count={countNotifications} />
                )}
                {!!accountLabel && <NavAccount label={accountLabel} />}
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
              <NavNotification count={countNotifications} />
              <NavAccount label={accountLabel} />
            </>
          </RightContainer>
        </MobileRightContainer>
      )}
    </NavLayout>
  );
};

export default UserNavbar;
