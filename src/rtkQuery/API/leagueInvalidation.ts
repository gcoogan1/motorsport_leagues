type LeagueInvalidationArgs = {
  accountId?: string | null;
  profileIds?: string[];
};

export const getLeagueInvalidationTags = ({
  accountId,
  profileIds = [],
}: LeagueInvalidationArgs) => {
  const tags = [
    { type: "Leagues" as const, id: "leagues-all--exclude-own" },
  ];

  if (accountId) {
    tags.push({ type: "Leagues" as const, id: `participant-leagues-${accountId}` });
  }

  for (const profileId of new Set(profileIds)) {
    tags.push({ type: "Leagues" as const, id: `profile-${profileId}` });
  }

  return tags;
};