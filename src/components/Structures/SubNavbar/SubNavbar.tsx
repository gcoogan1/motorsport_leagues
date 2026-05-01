import Button from "../../Button/Button";
import BackIcon from "@assets/Icon/Arrow_Backward.svg?react";
import type { ButtonVariant, ButtonColor } from "../../Button/Button.variants";
import {
  ContentContainer,
  LeftContent,
  Name,
  RightContent,
  SubNavbarContainer,
  SubNavbarWrapper,
} from "./SubNavbar.styles";

type SubNavbarProps = {
  name: string;
  onBack?: () => void;
  optionalAction?: {
    label: string;
    onClick: () => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: ButtonVariant;
    color?: ButtonColor;
  };
};

const SubNavbar = ({ name, onBack, optionalAction }: SubNavbarProps) => {
  return (
    <SubNavbarWrapper>
      <SubNavbarContainer>
        <ContentContainer>
          <LeftContent>
            <Button
              size="medium"
              variant="filled"
              color="base"
              onClick={onBack}
              icon={{ left: <BackIcon /> }}
              aria-label="Go back"
              rounded
            >
              Back
            </Button>
            <Name>{name}</Name>
          </LeftContent>
            {optionalAction && (
          <RightContent>
              <Button
                size="medium"
                variant={optionalAction.variant || "filled"}
                color={optionalAction.color || "base"}
                onClick={optionalAction.onClick}
                icon={{
                  left: optionalAction.leftIcon,
                  right: optionalAction.rightIcon,
                }}
              >
                {optionalAction.label}
              </Button>
          </RightContent>
            )}
        </ContentContainer>
      </SubNavbarContainer>
    </SubNavbarWrapper>
  );
};

export default SubNavbar;
