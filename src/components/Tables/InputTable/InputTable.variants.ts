import type { Tag } from "@/components/Tags/Tags.variants";

type TableItem = {
  id: string | number;
  name: string;
  value: string;
};

type ProfileOption = {
  label: string;
  value: string;
  secondaryInfo?: string;
  avatar: { avatarType: "preset" | "upload"; avatarValue: string };
};

export type ParticipantOption = {
  username: string;
  information?: string;
  size: "small" | "medium" | "large";
  avatarType: "preset" | "upload";
  avatarValue: string;
};

type TagOption = {
  value: Tag;
  label: string;
};

export type SelectOption = {
  value: string;
  label: string;
  secondaryInfo?: string;
  isDisabled?: boolean;
};

export type ResultTable = {
  p?: TableItem;
  driver?: {
    id: string | number;
    name: string;
    profiles: ProfileOption[];
    label: string;
  };
  time?: TableItem;
  points?: TableItem;
};

export type ParticipantTable = {
  number?: TableItem;
  participant?: {
    id: string | number;
    name: string;
  };
  role?: {
    id: string | number;
    name: string;
    options: TagOption[];
  };
};

export type CarTable = {
  category?: {
    id: string | number;
    name: string;
    options: SelectOption[];
  }
  model?: {
    id: string | number;
    name: string;
    options: SelectOption[];
  }
}
