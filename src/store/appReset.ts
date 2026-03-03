import type { AppDispatch } from "@/store";
import { clearAccount } from "@/store/account/account.slice";
import { clearProfiles } from "@/store/profile/profile.slice";
import { clearSquads } from "@/store/squads/squad.slice";
import { profileApi } from "@/store/rtkQueryAPI/profileApi";
import { squadApi } from "@/store/rtkQueryAPI/squadApi";

export const resetAppState = () => (dispatch: AppDispatch) => {
  dispatch(clearAccount());
  dispatch(clearProfiles());
  dispatch(clearSquads());
  dispatch(profileApi.util.resetApiState());
  dispatch(squadApi.util.resetApiState());
};
