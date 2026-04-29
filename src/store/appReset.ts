import type { AppDispatch } from "@/store";
import { clearAccount } from "@/store/account/account.slice";
import { clearProfiles } from "@/store/profile/profile.slice";
import { clearSquads } from "@/store/squads/squad.slice";
import { notificationApi } from "@/rtkQuery/API/notificationApi";
import { profileApi } from "@/rtkQuery/API/profileApi";
import { squadApi } from "@/rtkQuery/API/squadApi";

export const resetAppState = () => (dispatch: AppDispatch) => {
  dispatch(clearAccount());
  dispatch(clearProfiles());
  dispatch(clearSquads());
  dispatch(notificationApi.util.resetApiState());
  dispatch(profileApi.util.resetApiState());
  dispatch(squadApi.util.resetApiState());
};
