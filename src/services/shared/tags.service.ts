// Shared tag and participant utilities used across services

import { supabase } from "@/lib/supabase";
import type { Tag } from "@/components/Tags/Tags.variants";

export const isTag = (value: string): value is Tag => {
  return [
    "director",
    "founder",
    "driver",
    "host",
    "steward",
    "broadcaster",
    "staff",
    "champion",
  ].includes(value);
};

export const getParticipantTagsByLeagueAndProfile = async (
  leagueId: string,
  profileId: string,
): Promise<Tag[]> => {
  const participantResponse = await supabase
    .from("league_participants")
    .select("id")
    .eq("league_id", leagueId)
    .eq("profile_id", profileId)
    .maybeSingle();

  const participantId = participantResponse.data?.id;

  if (!participantId) {
    return [];
  }

  const rolesResponse = await supabase
    .from("league_participants_role")
    .select("role")
    .eq("participant_id", participantId);

  return (
    rolesResponse.data
      ?.map((roleRow: { role: string }) => roleRow.role)
      .filter(isTag) ?? []
  );
};
