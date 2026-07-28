import {
  useGetAnnouncementByIdQuery,
  useGetAnnouncementsByLeagueIdQuery,
  useGetAnnouncementsBySeasonIdQuery,
} from "@/rtkQuery/API/announcementsApi";

// --- Queries --- //
// Used to fetch data //

export const useGetAnnouncement = (announcementId: string) => {
  return useGetAnnouncementByIdQuery(announcementId ?? "", {
    skip: !announcementId,
  });
};

export const useGetAnnouncementsByLeagueId = (leagueId: string) => {
  return useGetAnnouncementsByLeagueIdQuery(leagueId ?? "", {
    skip: !leagueId,
  });
};

export const useGetAnnouncementsBySeasonId = (seasonId: string) => {
  return useGetAnnouncementsBySeasonIdQuery(seasonId ?? "", {
    skip: !seasonId,
  });
};
