import { useEffect } from "react";
import { useAppTheme } from "../hooks/useTheme";
import type { ThemeName } from "@/app/design/tokens/theme";

type Props = {
  themeName: ThemeName;
  children: React.ReactNode;
};

// Component to set the theme based on the provided themeName prop for Storybook stories
const ThemeSetter = ({ themeName, children }: Props) => {
  const { setThemeName } = useAppTheme();

  useEffect(() => {
    setThemeName(themeName);
  }, [themeName, setThemeName]);

  return <>{children}</>;
};

export default ThemeSetter;
