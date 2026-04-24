import { getTimezoneOptions } from "@/utils/timezone";
import type { SettingsFormValues } from "./settingsSchema";
import type { LeagueCover } from "@/types/league.types";

// Base timezone options for the timezone select input
export const baseTimezoneOptions = getTimezoneOptions();

// Helper function to get default form values when league data is not yet available
export const getDefaultSettingsValues = (fallbackTimezone: string): SettingsFormValues => ({
  leagueName: "",
  description: "",
  timezone: fallbackTimezone,
  cover: {
    type: "preset",
    variant: "cover1",
  },
  themeColor: "yellow",
});

// Helper function to map league settings to form values
export const getLeagueSettingsValues = (
  leagueName: string,
  description: string | undefined,
  timezone: string | undefined,
  fallbackTimezone: string,
  coverType: "preset" | "upload",
  coverValue: string,
  themeColor: SettingsFormValues["themeColor"],
): SettingsFormValues => ({
  leagueName,
  description: description ?? "",
  timezone: timezone ?? fallbackTimezone,
  cover:
    coverType === "preset"
      ? {
          type: "preset",
          variant: coverValue as LeagueCover,
        }
      : {
          type: "upload",
          previewUrl: coverValue,
        },
  themeColor,
});