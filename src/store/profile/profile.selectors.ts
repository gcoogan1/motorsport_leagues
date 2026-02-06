import type { RootState } from "@/store";
import type { ProfileViewType } from "@/types/profile.types";

export const selectProfileById = (profileId: string) => (state: RootState) =>
  state.profile.data?.find((p) => p.id === profileId);


export const selectProfileViewType =
  (profileId: string) =>
  (state: RootState): ProfileViewType => {
    const profile = state.profile.data?.find(p => p.id === profileId);
    const account = state.account.data;

    // Guest (not logged in)
    if (!account) return "guest";

    // Logged in but profile not loaded yet
    if (!profile) return "member";

    // Owner
    if (profile.account_id === account.id) {
      return "owner";
    }

    // Logged in, viewing someone else's profile
    return "member";
  };
