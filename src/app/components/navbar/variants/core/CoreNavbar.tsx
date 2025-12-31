import { useMediaQuery } from "@/hooks/useMediaQuery";
import Button from "@/components/Button/Button";
import Back from "@assets/Icon/Arrow_Backward.svg?react";
import NavLayout from "../../components/navLayout/NavLayout";
import NavBrand from "../../components/navBrand/NavBrand";
import NavAccount from "../../components/navAccount/NavAccount";
import NavNotification from "../../components/navNotification/NavNotification";
import {
  CenterContainer,
  LeftContainer,
  RightContainer,
} from "./CoreNavbar.styles";

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
            iconOnly
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
