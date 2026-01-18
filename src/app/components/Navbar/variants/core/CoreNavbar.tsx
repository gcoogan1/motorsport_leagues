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
import NavNotification from "../../components/NavNotification/NavNotification";
import {
  CenterContainer,
  LeftContainer,
  RightContainer,
} from "./CoreNavbar.styles";

type CoreNavbarProps = {
  user?: UserData;
  countNotifications?: number;
  accountLabel?: string;
};

const CoreNavbar = ({
  user,
  countNotifications,
  accountLabel,
}: CoreNavbarProps) => {
  const { loading } = useAuth();
  const isMobile = useMediaQuery("(max-width: 919px)");
  const navigate = useNavigate();
  const { openPanel } = usePanel();

  const goBackOrHome = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const openPanelOfType = (type: PanelTypes) => {
    openPanel(type);
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
            {!!countNotifications && (
              <NavNotification
                count={countNotifications}
                onClick={() => openPanelOfType("NOTIFICATIONS")}
              />
            )}
            {!!accountLabel && (
              <NavAccount
                label={accountLabel}
                onClick={() => openPanelOfType("ACCOUNT")}
              />
            )}
          </>
        )}
      </RightContainer>
    </NavLayout>
  );
};

export default CoreNavbar;
