import type { ReactNode } from "react";
import Icon from "../Icon/Icon";
import Spinner from "@assets/Icon/Spinner.svg?react";
import { StyledButton } from "./Button.styles";
import type { ButtonVariant, ButtonColor } from "./Button.variants";

type ButtonProps = {
  children?: ReactNode;
  size?: "small" | "tall";
  color?: ButtonColor;
  variant?: ButtonVariant;
  rounded?: boolean;
  iconOnly?: boolean;
  icon?: {
    left?: ReactNode;
    right?: ReactNode;
  };
  isLoading?: boolean;
  onClick: () => void;
};

const Button = ({
  children,
  onClick,
  size = "tall",
  color = "system",
  variant = "filled",
  rounded = false,
  iconOnly = false,
  icon,
  isLoading = false,
}: ButtonProps) => {
  return (
    <StyledButton
      onClick={onClick}
      $size={size}
      $rounded={rounded}
      $iconOnly={iconOnly}
      $variant={variant}
      $color={color}
      $isLoading={isLoading}
    >
      {isLoading ? (
        <>
          <Icon>
            <Spinner />
          </Icon>
          {!iconOnly && <span>Loading...</span>}
        </>
      ) : (
        <>
          {icon?.left && <Icon>{icon.left}</Icon>}
          {!iconOnly && children}
          {icon?.right && <Icon>{icon.right}</Icon>}
        </>
      )}
    </StyledButton>
  );
};

export default Button;
