import type { AvatarVariants } from "@/components/Avatar/Avatar.variants";

// Types for the MultiUserInput component, including the structure of user profiles and select options.

export type Profile = {
  id?: string;
  avatarType: "preset" | "upload";
  avatarValue: AvatarVariants | string;
  username: string;
  game: string;
};

export type SelectOption = {
  value: string;
  label: string;
  profileId?: string;
  isEmail?: boolean;
  __isNew__?: boolean;
  avatar?: {
    avatarType: "preset" | "upload";
    avatarValue: AvatarVariants | string;
  };
  secondaryInfo?: string;
};
