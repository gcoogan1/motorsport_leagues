import type { PanelTypes } from "@/types/panel.types";
import { usePanel } from "@/providers/panel/usePanel";
import Button from "@/components/Button/Button";
import Profile from "@assets/Icon/Profile.svg?react";
import Squad from "@assets/Icon/Squad.svg?react";
import League from "@assets/Icon/League.svg?react";
import NavBrand from "../../components/NavBrand/NavBrand";
import NavSelect from "../../components/NavSelect/NavSelect";
import NavLayout from "../../components/NavLayout/NavLayout";
import { useNavigate } from "react-router";
import {
  CenterContainer,
  LeftContainer,
  RightContainer,
} from "./GuestNavbar.styles";

//TODO: Add onClick handlers to NavSelects and NavAccount

const GuestNavbar = () => {
  const navigate = useNavigate();
  const { openPanel } = usePanel();

  const handleAccountSignup = () => {
    navigate("/create-account");
  };

  const handleAccountLogin = () => {
    navigate("/login");
  };

  const openPanelOfType = (type: PanelTypes) => {
    openPanel(type);
  };

  return (
    <NavLayout>
      <LeftContainer>
        <NavBrand />
      </LeftContainer>
      <CenterContainer>
        <>
          <NavSelect
            icon={<Profile />}
            label={"Profiles"}
            onClick={() => openPanelOfType("GUEST_PROFILES")}
          />
          <NavSelect
            icon={<Squad />}
            label={"Squads"}
            onClick={() => openPanelOfType("GUEST_SQUADS")}
          />
          <NavSelect
            icon={<League />}
            label={"Leagues"}
            onClick={() => openPanelOfType("GUEST_LEAGUES")}
          />
        </>
      </CenterContainer>
      <RightContainer>
        <>
          <Button
            color="system"
            variant="outlined"
            onClick={handleAccountLogin}
          >
            Log In
          </Button>
          <Button color="system" onClick={handleAccountSignup}>
            Get Started
          </Button>
        </>
      </RightContainer>
    </NavLayout>
  );
};

export default GuestNavbar;
