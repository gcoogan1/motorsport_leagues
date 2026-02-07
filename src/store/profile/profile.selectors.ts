import type { RootState } from "@/store";
import type { ProfileViewType } from "@/types/profile.types";

export const selectProfileById = (profileId: string) => (state: RootState) =>
  state.profile.data?.find((p) => p.id === profileId);

export const selectCurrentProfile = (state: RootState) =>
  state.profile.currentProfile;


export const selectProfileViewType = () =>
  (state: RootState): ProfileViewType => {
    const account = state.account.data;
    const currentProfile = state.profile.currentProfile;

    // Guest (not logged in)
    if (!account) return "guest";

    // Logged in, profile not loaded yet
    if (!currentProfile) return "member";

    // Owner
    if (currentProfile.account_id === account.id) {
      return "owner";
    }

    // Logged in, viewing someone else's profile
    return "member";
  };

