import type { SquadViewType } from "@/types/squad.types";
import { squadApi } from "@/store/rtkQueryAPI/squadApi";
import type { RootState } from "..";

export const selectSquadViewType = () => (state: RootState): SquadViewType | "loading" => {
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

  // Founder
  if (currentSquad.founder_account_id === account?.id) {
    return "founder";
  }

  const squadMembersResult = squadApi.endpoints.getSquadMembers.select(currentSquad.id)(state);
  const squadMembers = squadMembersResult?.data ?? [];
  const currentUserProfileIds = new Set(currentUserProfiles.map((profile) => profile.id));
  const isSquadMember = squadMembers.some((member) =>
    currentUserProfileIds.has(member.profile_id),
  );

  if (isSquadMember) {
    return "member";
  }

  // Logged in, viewing a squad they don't own
  return "user";
};

export const selectCurrentSquad = (state: RootState) => state.squad.currentSquad;
