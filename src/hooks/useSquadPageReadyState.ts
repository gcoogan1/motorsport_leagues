import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { selectSquadViewType } from "@/store/squads/squad.selectors";

export const useSquadPageReadyState = () => {
  const squadStatus = useSelector((state: RootState) => state.squad.status);
  const profileStatus = useSelector((state: RootState) => state.profile.status);
  const viewType = useSelector(selectSquadViewType());

  const isReady =
    squadStatus !== "loading" &&
    profileStatus !== "loading" &&
    viewType !== "loading";

  return {
    isReady,
    squadStatus,
    profileStatus,
    viewType,
  };
};