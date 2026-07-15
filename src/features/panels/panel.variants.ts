import type { PanelTypes } from "@/types/panel.types";
import AccountPanel from "./account/AccountPanel";
import NotificationsPanel from "./notifications/NotificationsPanel";
import ProfilesPanel from "./profiles/ProfilesPanel";
import GuestProfilesPanel from "./profiles/variants/GuestProfilesPanel";
import SquadsPanel from "./squads/SquadsPanel";
import LeaguesPanel from "./leagues/LeaguesPanel";
import GuestSquadsPanel from "./squads/vaiants/GuestSquadsPanel";
import GuestLeaguesPanel from "./leagues/variants/GuestLeaguesPanel";
import ProfileEdit from "./profileEdit/ProfileEdit";
import ProfileFollowers from "./profileFollowers/ProfileFollowers";
import SquadEdit from "./squadEdit/SquadEdit";
import SquadFollowers from "./squadFollowers/SquadFollowers";
import SquadMembers from "./squadMembers/SquadMembers";
import LeagueFollowers from "./leagueFollowers/LeagueFollowers";
import LeagueJoin from "./leagueJoin/LeagueJoin";
import LeagueParticipants from "./leagueParticipants/LeaguePart";
import BriefingPanel from "./rounds/forms/Briefing/BriefingPanel";
import DriverGridPanel from "./rounds/forms/DriverGrid/DriverGridPanel";
import EventSettings from "./events/forms/EventSettings/EventSettings";
import TrackCarDetails from "./events/forms/TrackCarDetails/TrackCarDetails";
import SessionSettings from "./events/forms/SessionSettings/SessionSettings";
import AdvancedSettings from "./events/forms/AdvancedSettings/AdvancedSettings";
import SquadChat from "./squadChat/SquadChat";
import Announcements from "./announcements/Announcements";
import LeagueChat from "./leagueChat/LeagueChat";
import ReportIncident from "./reportIncident/ReportIncident";
import Tickets from "./tickets/Tickets";


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
  PROFILE_FOLLOWERS: ProfileFollowers,
  SQUAD_EDIT: SquadEdit,
  SQUAD_FOLLOWERS: SquadFollowers,
  SQUAD_MEMBERS: SquadMembers,
  LEAGUE_FOLLOWERS: LeagueFollowers,
  LEAGUE_JOIN: LeagueJoin,
  LEAGUE_PARTICIPANTS: LeagueParticipants,
  BRIEFING: BriefingPanel,
  DRIVER_GRID: DriverGridPanel,
  EVENT_SETTINGS: EventSettings,
  TRACK_CAR_DETAILS: TrackCarDetails,
  SESSION_SETTINGS: SessionSettings,
  ADVANCED_SETTINGS: AdvancedSettings,
  SQUAD_CHAT: SquadChat,
  LEAGUE_CHAT: LeagueChat,
  LEAGUE_ANNOUNCEMENTS: Announcements,
  REPORT: ReportIncident,
  TICKET: Tickets
};