import { GAME_FULL_NAMES, type ProfileTable } from "@/types/profile.types";

export type ProfileSelectOption = {
  label: string;
  value: string;
  secondaryInfo?: string;
  avatar: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
};

export const convertProfilesToSelectOptions = (
  profiles: ProfileTable[] | null | undefined,
): ProfileSelectOption[] =>
  (profiles ?? []).map((profile) => ({
    label: profile.username,
    value: profile.id,
    secondaryInfo: profile.game_type
      ? GAME_FULL_NAMES[profile.game_type]
      : undefined,
    avatar: {
      avatarType: profile.avatar_type,
      avatarValue: profile.avatar_value,
    },
  }));
