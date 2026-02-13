import { designTokens } from "@/app/design/tokens";
import type { ThemeName } from "@/app/design/tokens/theme";

const { colors, theme } = designTokens;

export type Tag = 'director' | 'founder' | 'driver' |  'host' | 'steward' | 'broadcast' | 'staff' | 'champion';

export type TagVariant = {
  name: string;
  label: string;
  color: string;
  background: string;
}

export const getTagVariants = (themeName: ThemeName): TagVariant[] => {
  const activeTheme = theme[themeName];

  return [
    { name: "director", label: "Director", color: colors.text.text1, background: colors.role.director },
    { name: "founder", label: "Founder", color: colors.text.text1, background: colors.role.director },
    { name: "driver", label: "Driver", color: activeTheme.primaryA, background: activeTheme.primary10 },
    { name: "host", label: "Host", color: activeTheme.primaryA, background: activeTheme.primary10 },
    { name: "steward", label: "Steward", color: activeTheme.primaryA, background: activeTheme.primary10 },
    { name: "broadcast", label: "Broadcast", color: activeTheme.primaryA, background: activeTheme.primary10 },
    { name: "staff", label: "Staff", color: activeTheme.primaryA, background: activeTheme.primary10 },
    { name: "champion", label: "Champion", color: colors.text.text1, background: colors.role.champion },
  ];
};