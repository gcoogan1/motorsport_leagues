type IconSize = "small" | "medium" | "large" | "xLarge";

type IconProps = {
  size?: IconSize;
  children: React.ReactNode;
  ariaLabel?: string;
};

const ICON_SIZES: Record<IconSize, number> = {
  small: 18,
  medium: 20,
  large: 24,
  xLarge: 28,
};

const Icon = ({ size = "medium", ariaLabel, children }: IconProps) => {
  const sizeValue = ICON_SIZES[size];

  return (
    <span
      style={{
        display: "inline-flex",
        width: sizeValue,
        height: sizeValue,
        alignItems: "center",
        justifyContent: "center",
        color: "inherit",
      }}
      aria-label={ariaLabel}
    >
      {children}
    </span>
  );
};

export default Icon;
