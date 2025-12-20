import { fadeGradient, withOpacity } from "./color";

// --- THEME MODULE --- //

// Types
type Theme = 'yellow' | 'blue' | 'red' | 'green';
type ThemeTokens = {
  primaryA: string;
  primaryA2: string;
  primaryA3: string;
};

// Helper
// Primary Theme Colors
export const primaryThemeTokens: Record<Theme, ThemeTokens> = {
  yellow: {
    primaryA: '#FFF258',
    primaryA2: '#B9B044',
    primaryA3: '#B9B044',
  },
  blue: {
    primaryA: "#44FCFF",
    primaryA2: "#36B7B9",
    primaryA3: "#2D888A"
  },
  red: {
    primaryA: "#FF5151",
    primaryA2: "#B93F3F",
    primaryA3: "#8A3333"
  },
  green: {
    primaryA: "#7EFF5B",
    primaryA2: "#5FB946",
    primaryA3: "#4A8A38"
  }
};

// Function
// Generate Theme Color Variants that include opacity and gradients
const generateThemeColorVariants = (colorTheme: Theme) => {
  const theme = primaryThemeTokens[colorTheme];
  const primary0 = withOpacity(theme.primaryA, 0);
  const primary10 = withOpacity(theme.primaryA, 10);
  const primary30 = withOpacity(theme.primaryA, 30); 
  const primary20 = withOpacity(theme.primaryA, 20);

  return {
    primaryA: theme.primaryA,
    primaryA2: theme.primaryA2,
    primaryA3: theme.primaryA3,
    primary0,
    primary10,
    primary20,
    primary30,
    primaryGradientFadeLeft: fadeGradient(theme.primaryA, 30, 'left'),
    primaryGradientFadeLeft50: fadeGradient(theme.primaryA, 10, 'left', 50),
    primaryGradientFadeTop10: fadeGradient(theme.primaryA, 10, 'top'),
    primaryGradientFadeTop30: fadeGradient(theme.primaryA, 30, 'top'),
    primaryGradientFadeRight: fadeGradient(theme.primaryA, 30, 'right'),
    primaryGradientFadeRight50: fadeGradient(theme.primaryA, 10, 'right', 50),
    primaryGradientFadeBottom: fadeGradient(theme.primaryA, 30, 'bottom'),
    primaryGradientFadeBottom30: fadeGradient(theme.primaryA, 30, 'bottom', 30),
  };
}

// --- THEME TOKENS --- //
export const themeTokens = {
  yellow: generateThemeColorVariants('yellow'),
  blue: generateThemeColorVariants('blue'),
  red: generateThemeColorVariants('red'),
  green: generateThemeColorVariants('green'),
}




