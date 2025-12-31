import { useMediaQuery } from "@/hooks/useMediaQuery";
import Profile from "@assets/Icon/Profile.svg?react";
import Squad from "@assets/Icon/Squad.svg?react";
import League from "@assets/Icon/League.svg?react";
import NavBrand from "../../components/navBrand/NavBrand";
import NavSelect from "../../components/navSelect/NavSelect";
import NavLayout from "../../components/navLayout/NavLayout";
import NavNotification from "../../components/navNotification/NavNotification";
import NavAccount from "../../components/navAccount/NavAccount";
import {
  CenterContainer,
  LeftContainer,
  MobileRightContainer,
  RightContainer,
} from "./UserNavbar.styles";
import { useIsWrapped } from "@/hooks/useIsWrapped";

//TODO: Add onClick handlers to NavSelects and NavAccount

type UserNavbarProps = {
  countNotifications?: number;
  accountLabel?: string;
};

const UserNavbar = ({ countNotifications, accountLabel }: UserNavbarProps) => {
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
            <>
              <NavNotification count={countNotifications} />
              <NavAccount label={accountLabel} />
            </>
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
