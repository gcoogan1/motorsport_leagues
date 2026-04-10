// --- Mutations --- //
// Used to modify data //

import {
  useCreateLeagueSeasonMutation,
  useRemoveLeagueSeasonMutation,
  useUpdateLeagueSeasonMutation,
} from "@/store/rtkQueryAPI/leagueApi";

export const useCreateLeagueSeason = () => {
  return useCreateLeagueSeasonMutation();
};

export const useUpdateLeagueSeason = () => {
  return useUpdateLeagueSeasonMutation();
};

export const useRemoveLeagueSeason = () => {
  return useRemoveLeagueSeasonMutation();
};