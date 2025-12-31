import Button from "@/components/Button/Button";
import Profile from "@assets/Icon/Profile.svg?react";
import Squad from "@assets/Icon/Squad.svg?react";
import League from "@assets/Icon/League.svg?react";
import NavBrand from "../../components/navBrand/NavBrand";
import NavSelect from "../../components/navSelect/NavSelect";
import NavLayout from "../../components/navLayout/NavLayout";
import {
  CenterContainer,
  LeftContainer,
  RightContainer,
} from "./GuestNavbar.styles";

//TODO: Add onClick handlers to NavSelects and NavAccount

const GuestNavbar = () => {
  return (
    <NavLayout>
      <LeftContainer>
        <NavBrand />
      </LeftContainer>
      <CenterContainer>
        <>
          <NavSelect icon={<Profile />} label={"Profiles"} />
          <NavSelect icon={<Squad />} label={"Squads"} />
          <NavSelect icon={<League />} label={"Leagues"} />
        </>
      </CenterContainer>
      <RightContainer>
        <>
          <Button color="system" variant="outlined" onClick={() => {}}>
            Log In
          </Button>
          <Button color="system" onClick={() => {}}>
            Get Started
          </Button>
        </>
      </RightContainer>
    </NavLayout>
  );
};

export default GuestNavbar;
