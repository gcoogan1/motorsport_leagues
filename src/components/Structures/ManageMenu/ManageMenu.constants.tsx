import ParticipantsIcon from "@assets/Icon/Participants.svg?react";
import LeagueIcon from "@assets/Icon/League.svg?react";
import SeasonSetupIcon from "@assets/Icon/Season_Setup.svg?react";
import OverviewIcon from "@assets/Icon/Overview.svg?react";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import DateIcon from "@assets/Icon/Date.svg?react";
import ResultsIcon from "@assets/Icon/Results.svg?react";
import StewardsIcon from "@assets/Icon/Stewards.svg?react";
import type { ManageMenuSection } from "./ManageMenu";

// -- Management Links -- //
export const generalLinks: Array<{
  id: ManageMenuSection;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    id: "participant-roles",
    label: "Participant Roles",
    icon: <ParticipantsIcon />,
  },
  {
    id: "league-settings",
    label: "League Settings",
    icon: <LeagueIcon />,
  },
];

// -- Season-Specific Links -- //
export const seasonLinks: Array<{
  id: ManageMenuSection;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    id: "season-settings",
    label: "Season Settings",
    icon: <SeasonSetupIcon />,
  },
  {
    id: "overview-page",
    label: "Overview Page",
    icon: <OverviewIcon />,
  },
  {
    id: "driver-assignments",
    label: "Driver Assignments",
    icon: <ProfileIcon />,
  },
  {
    id: "schedule-rounds",
    label: "Schedule Rounds",
    icon: <DateIcon />,
  },
  {
    id: "enter-results",
    label: "Enter Results",
    icon: <ResultsIcon />,
  },
  {
    id: "rules-and-regulations",
    label: "Rules & Regulations",
    icon: <StewardsIcon />,
  },
];