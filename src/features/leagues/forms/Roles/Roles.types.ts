import type { LEAGUE_PARTICIPANT_ROLES } from "@/types/league.types";
import type { Tag } from "storybook/internal/csf";

export type LeagueRole = typeof LEAGUE_PARTICIPANT_ROLES[number];
export type LeagueRoleTag = Extract<Tag, LeagueRole>;

export type GroupedJoinRequest = {
  requestId: string;
  profileId: string;
  accountId: string;
  username: string;
  avatarType: "preset" | "upload";
  avatarValue: string;
  contactInfo: string;
  requestIds: string[]; // needed to view request modal
  requestedRoles: LeagueRole[]; // needed to view request modal
};

export type ParticipantRoleRow = {
  participantId: string;
  participant: {
    username: string;
    information: string;
    size: "small" | "medium" | "large";
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
  selectedRoles: LeagueRoleTag[];
  contactInfo?: string;
  profileId?: string;
  gameType?: string;
};

export type RolesFormValues = {
  options: string[];
  openApplications: boolean;
  participants: ParticipantRoleRow[];
};