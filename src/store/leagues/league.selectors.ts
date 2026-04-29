import { createSelector } from "@reduxjs/toolkit";
import { leagueApi } from "@/rtkQuery/API/leagueApi";
import type { LeagueViewType } from "@/types/league.types";
import type { RootState } from "..";

// Selector to determine the user's view type for the current league

const selectCurrentLeagueParticipantsResult = (state: RootState) => {
  const currentLeague = state.league.currentLeague;

  if (!currentLeague) {
    return null;
  }

  return leagueApi.endpoints.getLeagueParticipants.select(currentLeague.id)(state);
};

// Selector to determine if the current user is a director of the current league
export const selectIsCurrentLeagueParticipantDirector = (
  state: RootState,
): boolean | null => {
  const currentUserProfiles = state.profile.data ?? [];
  const leagueParticipantsResult = selectCurrentLeagueParticipantsResult(state);

  if (
    !leagueParticipantsResult ||
    leagueParticipantsResult.isUninitialized ||
    leagueParticipantsResult.isLoading
  ) {
    return null;
  }

  const currentUserProfileIds = new Set(
    currentUserProfiles.map((profile) => profile.id),
  );

  return (leagueParticipantsResult.data ?? []).some(
    (participant) =>
      currentUserProfileIds.has(participant.profile_id) &&
      participant.roles.includes("director"),
  );
};

// Main selector to determine the league view type for the current user
// view types: "loading" (while data is loading), "guest" (not logged in), "user" (logged in but not a participant), "participant" (logged in and a participant)
export const selectLeagueViewType = (
  state: RootState,
): LeagueViewType | "loading" => {
  const account = state.account.data;
  const accountStatus = state.account.status;
  const currentUserProfiles = state.profile.data ?? [];
  const currentLeague = state.league.currentLeague;
  const leagueStatus = state.league.status;

  if (leagueStatus === "loading" || accountStatus === "loading") {
    return "loading";
  }

  if (!account) {
    return "guest";
  }

  if (!currentLeague) {
    return "loading";
  }

  const leagueParticipantsResult = selectCurrentLeagueParticipantsResult(state);

  if (
    !leagueParticipantsResult ||
    leagueParticipantsResult.isUninitialized ||
    leagueParticipantsResult.isLoading
  ) {
    return "loading";
  }

  const leagueParticipants = leagueParticipantsResult.data ?? [];
  const currentUserProfileIds = new Set(
    currentUserProfiles.map((profile) => profile.id),
  );

  const isLeagueParticipant = leagueParticipants.some((participant) =>
    currentUserProfileIds.has(participant.profile_id),
  );

  return isLeagueParticipant ? "participant" : "user";
};

export const selectCurrentLeague = (state: RootState) =>
  state.league.currentLeague;

export const selectHasLeagues = createSelector(
  (state: RootState) => state.league.data,
  (state: RootState) => state.league.status,
  (leagues, status) => {
    if (status === "loading") {
      return null;
    }

    return leagues != null && leagues.length > 0;
  },
);