import type { PanelTypes } from "@/types/panel.types";
import AccountPanel from "./account/AccountPanel";
import NotificationsPanel from "./notifications/NotificationsPanel";
import ProfilesPanel from "./profiles/ProfilesPanel";
import SquadsPanel from "./squads/SquadsPanel";
import LeaguesPanel from "./leagues/LeaguesPanel";


export const panelVariants: Record<PanelTypes, React.FC> = {
  ACCOUNT: AccountPanel,
  NOTIFICATIONS: NotificationsPanel,
  PROFILES: ProfilesPanel,
  SQUADS: SquadsPanel,
  LEAGUES: LeaguesPanel
};