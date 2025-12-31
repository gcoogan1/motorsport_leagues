import type { ReactNode } from "react";
import Icon from "../Icon/Icon";
import Spinner from "@assets/Icon/Spinner.svg?react";
import { StyledButton } from "./Button.styles";
import type { ButtonVariant, ButtonColor } from "./Button.variants";

type ButtonProps = {
  children?: ReactNode;
  size?: "small" | "medium";
  color?: ButtonColor;
  variant?: ButtonVariant;
  rounded?: boolean;
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
  size = "medium",
  color = "system",
  variant = "filled",
  rounded = false,
  icon,
  isLoading = false,
}: ButtonProps) => {
  return (
    <StyledButton
      onClick={onClick}
      $size={size}
      $rounded={rounded}
      $variant={variant}
      $color={color}
      $isLoading={isLoading}
    >
      {isLoading ? (
        <>
          <Icon>
            <Spinner />
          </Icon>
          {<span>Loading...</span>}
        </>
      ) : (
        <>
          {icon?.left && <Icon>{icon.left}</Icon>}
          {children}
          {icon?.right && <Icon>{icon.right}</Icon>}
        </>
      )}
    </StyledButton>
  );
};

export default Button;
