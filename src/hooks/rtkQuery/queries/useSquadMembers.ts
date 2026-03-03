import { useGetSquadMembersQuery } from "@/store/rtkQueryAPI/squadApi";

// Query for fetching members of a squad
export const useSquadMembers = (squadId?: string) =>
  useGetSquadMembersQuery(squadId ?? "", { skip: !squadId });
