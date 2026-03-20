import type { SquadViewType } from "@/types/squad.types";
import type { RootState } from "..";

// TODO: Add viewType "member" for logged in users who are not the squad founder but are viewing a squad they belong to. 
// Will need to update selectSquadViewType selector and SquadHeader component to handle this new view type and show appropriate actions (e.g. leave squad, view members, etc.)

export const selectSquadViewType = () => (state: RootState): SquadViewType | "loading" => {
  const account = state.account.data;
  const accountStatus = state.account.status;
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

  // Logged in, viewing a squad they don't own
  return "user";
};

export const selectCurrentSquad = (state: RootState) => state.squad.currentSquad;
