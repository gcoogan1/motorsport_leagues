import { useMemo } from "react";
import type { ProfileTable } from "@/types/profile.types";
import type { SquadMemberProfile } from "@/types/squad.types";

// Founder context for invite/leave flows.

type UseSquadFounderContextArgs = {
  squadMembers: SquadMemberProfile[];
  currentUserProfiles: ProfileTable[];
  currentProfileId?: string;
};

export const useSquadFounderContext = ({
  squadMembers,
  currentUserProfiles,
  currentProfileId,
}: UseSquadFounderContextArgs) => {
  return useMemo(() => {
    const userProfileIds = new Set(currentUserProfiles.map((profile) => profile.id));

    // Founders listed in the SQUAD MEMBERS table.
    const memberFounders = squadMembers.filter((member) => member.role === "founder");

    // Founders from SQUAD MEMBERS table that belong to the logged-in user.
    const userMemberFounders = memberFounders.filter((member) =>
      userProfileIds.has(member.profile_id),
    );

    // Count unique founder profiles to determine if viewer is the only founder.
    const allFounderIds = new Set(memberFounders.map((member) => member.profile_id));
    const founderCount = allFounderIds.size;

    const isViewerFounder = userMemberFounders.length > 0;
    const isOnlyFounder = isViewerFounder && founderCount === 1;

    // Inviter founder profiles owned by this user.
    const inviterProfileIds = new Set(
      userMemberFounders.map((member) => member.profile_id),
    );

    // Get inviter profiles from current user's profiles.
    const inviterProfiles = currentUserProfiles.filter((profile) =>
      inviterProfileIds.has(profile.id),
    );

    // Prefer active profile when valid; otherwise pick first candidate.
    const inviterFounderProfile =
      (currentProfileId
        ? inviterProfiles.find((profile) => profile.id === currentProfileId)
        : undefined) ?? inviterProfiles[0];

    // Membership username is a fallback when profile data is not ready.
    const inviterMembership = userMemberFounders.find(
      (member) => member.profile_id === inviterFounderProfile?.id,
    );

    const inviterFounderUsername =
      inviterFounderProfile?.username ?? inviterMembership?.username ?? "";

    return {
      founderMembers: memberFounders,
      viewerFounderMembers: userMemberFounders,
      isViewerFounder,
      isOnlyFounder,
      inviterFounderProfile,
      inviterFounderUsername,
      inviterFounderProfileId: inviterFounderProfile?.id ?? "",
      inviterFounderAccountId: inviterFounderProfile?.account_id ?? "",
    };
  }, [
    squadMembers,
    currentUserProfiles,
    currentProfileId,
  ]);
};
