import { useMemo } from "react";
import type { ProfileTable } from "@/types/profile.types";
import type { LeagueParticipantProfile } from "@/types/league.types";

// Director context for invite/leave flows in leagues.
// Provides information about whether the viewer is a director, whether they're the only director, and details about the inviter director (if applicable).

type UseLeagueDirectorContextArgs = {
  leagueParticipants: LeagueParticipantProfile[];
  currentUserProfiles: ProfileTable[];
  currentProfileId?: string;
};

export const useLeagueDirectorContext = ({
  leagueParticipants,
  currentUserProfiles,
  currentProfileId,
}: UseLeagueDirectorContextArgs) => {
  return useMemo(() => {
    const userProfileIds = new Set(currentUserProfiles.map((profile) => profile.id));

    // Directors listed in the LEAGUE PARTICIPANTS table.
    const participantDirectors = leagueParticipants.filter((participant) =>
      participant.roles.includes("director")
    );

    // Directors from LEAGUE PARTICIPANTS table that belong to the logged-in user.
    const userParticipantDirectors = participantDirectors.filter((participant) =>
      userProfileIds.has(participant.profile_id)
    );

    // Count unique director profiles to determine if viewer is the only director.
    const allDirectorIds = new Set(participantDirectors.map((participant) => participant.profile_id));
    const directorCount = allDirectorIds.size;

    const isViewerDirector = userParticipantDirectors.length > 0;
    const isOnlyDirector = isViewerDirector && directorCount === 1;

    // Inviter director profiles owned by this user.
    const inviterProfileIds = new Set(
      userParticipantDirectors.map((participant) => participant.profile_id)
    );

    // Get inviter profiles from current user's profiles.
    const inviterProfiles = currentUserProfiles.filter((profile) =>
      inviterProfileIds.has(profile.id)
    );

    // Prefer active profile when valid; otherwise pick first candidate.
    const inviterDirectorProfile =
      (currentProfileId
        ? inviterProfiles.find((profile) => profile.id === currentProfileId)
        : undefined) ?? inviterProfiles[0];

    // Membership username is a fallback when profile data is not ready.
    const inviterMembership = userParticipantDirectors.find(
      (participant) => participant.profile_id === inviterDirectorProfile?.id
    );

    const inviterDirectorUsername =
      inviterDirectorProfile?.username ?? inviterMembership?.username ?? "";

    return {
      directorParticipants: participantDirectors,
      viewerDirectorParticipants: userParticipantDirectors,
      isViewerDirector,
      isOnlyDirector,
      inviterDirectorProfile,
      inviterDirectorUsername,
      inviterDirectorProfileId: inviterDirectorProfile?.id ?? "",
      inviterDirectorAccountId: inviterDirectorProfile?.account_id ?? "",
    };
  }, [
    leagueParticipants,
    currentUserProfiles,
    currentProfileId,
  ]);
};
