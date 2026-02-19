import type { PanelTypes } from "@/types/panel.types";
import AccountPanel from "./account/AccountPanel";
import NotificationsPanel from "./notifications/NotificationsPanel";
import ProfilesPanel from "./profiles/ProfilesPanel";
import GuestProfilesPanel from "./profiles/variants/GuestProfilesPanel";
import SquadsPanel from "./squads/SquadsPanel";
import LeaguesPanel from "./leagues/LeaguesPanel";
import GuestSquadsPanel from "./squads/GuestSquadsPanel";
import GuestLeaguesPanel from "./leagues/GuestLeaguesPanel";
import ProfileEdit from "./profileEdit/ProfileEdit";
import ProfileFollowers from "./profileFollowers/ProfileFollowers";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const panelVariants: Record<PanelTypes, React.ComponentType<any>> = {
  ACCOUNT: AccountPanel,
  NOTIFICATIONS: NotificationsPanel,
  PROFILES: ProfilesPanel,
  GUEST_PROFILES: GuestProfilesPanel,
  SQUADS: SquadsPanel,
  GUEST_SQUADS: GuestSquadsPanel,
  LEAGUES: LeaguesPanel,
  GUEST_LEAGUES: GuestLeaguesPanel,
  PROFILE_EDIT: ProfileEdit,
  PROFILE_FOLLOWERS: ProfileFollowers
};