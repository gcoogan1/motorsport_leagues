import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { selectLeagueViewType } from "@/store/leagues/league.selectors";

export const useLeaguePageReadyState = () => {
  const leagueStatus = useSelector((state: RootState) => state.league.status);
  const profileStatus = useSelector((state: RootState) => state.profile.status);
  const viewType = useSelector(selectLeagueViewType);

  const isReady =
    leagueStatus !== "loading" &&
    profileStatus !== "loading" &&
    viewType !== "loading";

  return {
    isReady,
    leagueStatus,
    profileStatus,
    viewType,
  };
};