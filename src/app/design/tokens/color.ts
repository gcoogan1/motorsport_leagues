// --- COLOR MODULE --- //

// Types
type Direction = "left" | "right" | "top" | "bottom";
type Opacity = 0 | 10 | 20 | 30 | 100;
type ColorTokens = {
  colors: {
    base: Record<string, string>;
    text: Record<string, string>;
    role: Record<string, string>;
    position: Record<string, string>;
    alert: Record<string, string>;
    utility: Record<string, string>;
  };
  gradients: {
    base: Record<string, string>;
    alert: Record<string, string>;
    position: Record<string, string>;
  };
};

// -- Opacity -- //
// Helper
export const opacity: Record<Opacity, number> = {
  0: 0.0,
  10: 0.1,
  20: 0.2,
  30: 0.3,
  100: 1.0,
};
// Function
// Convert hex to rgba with opacity
export const withOpacity = (hex: string, opacityLevel: Opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // converted opacity
  const o = opacity[opacityLevel];

  return `rgba(${r}, ${g}, ${b}, ${o})`;
};

// -- Gradients -- //
// Helper
const gradientDirection: Record<Direction, number> = {
  left: 270,
  top: 0,
  right: 90,
  bottom: 180,
};
// Function
// Create a fade gradient
export const fadeGradient = (
  color: string,
  opacityLevel: Opacity,
  direction: Direction,
  endPercent: number = 100
) => {
  const percentage = endPercent ? `${endPercent}%` : "100%";
  return `linear-gradient(
    ${gradientDirection[direction]}deg,
    ${withOpacity(color, opacityLevel)} 0%,
    ${withOpacity(color, 0)} ${percentage}
  )`;
};

// --- COLOR TOKENS --- //
export const colorTokens: ColorTokens = {
  colors: {
    base: {
      base1: "#080808",
      base2: "#151515",
      base3: "#2D2D2D",
      base4: "#4B4B4B",
      translucent10: withOpacity("#FFFFFF", 10),
      translucent20: withOpacity("#FFFFFF", 20),
      translucent30: withOpacity("#FFFFFF", 30),
    },
    text: {
      text1: "#FFFFFF",
      text2: "#A5A5A5",
      text3: "#858585",
    },
    role: {
      director: "#FF5900",
      champion: "#8C00FF",
    },
    position: {
      gold: "#D0BA03",
      silver: "#7A7675",
      bronze: "#3C2617",
    },
    alert: {
      alertA: "#FF0000",
      alertA2: "#CC0000",
      alertA3: "#9C0000",
    },
    utility: {
      focus: "#0044FF",
      link: "#00C4FF",
      success: "#007818",
    },
  },
  gradients: {
    base: {
      fadeLeft10: fadeGradient("#FFFFFF", 10, "left"),
      fadeTop10: fadeGradient("#FFFFFF", 10, "top"),
      fadeRight10: fadeGradient("#FFFFFF", 10, "right"),
      fadeBottom10: fadeGradient("#FFFFFF", 10, "bottom"),
      fadeLeft20: fadeGradient("#FFFFFF", 20, "left"),
      fadeTop20: fadeGradient("#FFFFFF", 20, "top"),
      fadeRight20: fadeGradient("#FFFFFF", 20, "right"),
      fadeBottom20: fadeGradient("#FFFFFF", 20, "bottom"),
      fadeOutHorizontal10:
        "linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%)",
      fadeOutHorizontal20:
        "linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0) 100%)",
      fadeOutHorizontal80:
        "linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)",
    },
    alert: {
      fadeOutHorizontal80:
        "linear-gradient(270deg, rgba(255, 0, 0, 0) 0%, rgba(255, 0, 0, 0.8) 50%, rgba(255, 0, 0, 0) 100%)",
    },
    position: {
      goldLeft: fadeGradient("#D0BA03", 100, "left"),
      silverLeft: fadeGradient("#7A7675", 100, "left"),
      bronzeLeft: fadeGradient("#3C2617", 100, "left"),
    },
  },
};