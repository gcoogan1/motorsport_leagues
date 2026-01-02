import { useMediaQuery } from "@/hooks/useMediaQuery";
import Button from "@/components/Button/Button";
import Back from "@assets/Icon/Arrow_Backward.svg?react";
import NavLayout from "../../components/NavLayout/NavLayout";
import NavBrand from "../../components/NavBrand/NavBrand";
import NavAccount from "../../components/NavAccount/NavAccount";
import NavNotification from "../../components/NavNotification/NavNotification";
import {
  CenterContainer,
  LeftContainer,
  RightContainer,
} from "./CoreNavbar.styles";

// TODO: Add onClick handler to NavAccount & on Back button

type CoreNavbarProps = {
  countNotifications?: number;
  accountLabel?: string;
};

const CoreNavbar = ({ countNotifications, accountLabel }: CoreNavbarProps) => {
  const isMobile = useMediaQuery("(max-width: 919px)");

  return (
    <NavLayout>
      <LeftContainer>
        {isMobile ? (
          <Button
            color="base"
            rounded
            icon={{ left: <Back /> }}
            onClick={() => {}}
          />
        ) : (
          <Button
            color="base"
            rounded
            icon={{ left: <Back /> }}
            onClick={() => {}}
          >
            Back
          </Button>
        )}
      </LeftContainer>
      <CenterContainer>
        <NavBrand />
      </CenterContainer>
      <RightContainer>
        <>
          <NavNotification count={countNotifications} />
          <NavAccount label={accountLabel} />
        </>
      </RightContainer>
    </NavLayout>
  );
};

export default CoreNavbar;
