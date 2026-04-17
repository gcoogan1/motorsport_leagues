import { useState } from "react";
import { ToggleSwitchWrapper, ToggleThumb } from "./ToggleSwitch.styles";

type ToggleSwitchProps = {
  isOn?: boolean;
  defaultOn?: boolean;
  onChange?: (isOn: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
};

const ToggleSwitch = ({
  isOn,
  defaultOn = false,
  onChange,
  disabled = false,
  ariaLabel = "Toggle",
}: ToggleSwitchProps) => {
  const [internalOn, setInternalOn] = useState(defaultOn);

  const isControlled = isOn !== undefined;
  const currentOn = isControlled ? isOn : internalOn;

  const handleToggle = () => {
    if (disabled) return;
    const next = !currentOn;
    if (!isControlled) setInternalOn(next);
    onChange?.(next);
  };

  return (
    <ToggleSwitchWrapper
      $isOn={currentOn}
      role="switch"
      aria-checked={currentOn}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <ToggleThumb $isOn={currentOn} />
    </ToggleSwitchWrapper>
  );
};

export default ToggleSwitch;
