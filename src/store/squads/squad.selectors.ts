import type { SquadViewType } from "@/types/squad.types";
import { squadApi } from "@/rtkQuery/API/squadApi";
import type { RootState } from "..";
import { createSelector } from "@reduxjs/toolkit";

export const selectSquadViewType = (
  state: RootState,
): SquadViewType | "loading" => {
  const account = state.account.data;
  const accountStatus = state.account.status;
  const currentUserProfiles = state.profile.data ?? [];
  const currentSquad = state.squad.currentSquad;
  const squadStatus = state.squad.status;

  // If actively fetching the squad, don't guess the viewType yet
  if (squadStatus === "loading" || accountStatus === "loading") {
    return "loading";
  }

  // Guest (not logged in)
  if (!account) return "guest";

  // Logged in, squad not loaded yet
  if (!currentSquad) return "loading";

  const squadMembersResult = squadApi.endpoints.getSquadMembers.select(
    currentSquad.id,
  )(state);

  if (squadMembersResult.isUninitialized || squadMembersResult.isLoading) {
    return "loading";
  }

  const squadMembers = squadMembersResult?.data ?? [];
  const currentUserProfileIds = new Set(
    currentUserProfiles.map((profile) => profile.id),
  );

  const isSquadMember = squadMembers.some((member) =>
    currentUserProfileIds.has(member.profile_id),
  );
  const isSquadFounderByRole = squadMembers.some((member) =>
    currentUserProfileIds.has(member.profile_id) && member.role === "founder",
  );
  
  // Founder is derived from members table role only.
  if (isSquadFounderByRole) {
    return "founder";
  }

  if (isSquadMember) {
    return "member";
  }

  // Logged in, viewing a squad they don't own
  return "user";
};

export const selectCurrentSquad = (state: RootState) => state.squad.currentSquad;

export const selectHasSquads = createSelector(
  (state: RootState) => state.squad.data,
  (state: RootState) => state.squad.status,
  (squads, status) => {
    if (status === "loading") return null;
    return squads != null && squads.length > 0;
  }
)
