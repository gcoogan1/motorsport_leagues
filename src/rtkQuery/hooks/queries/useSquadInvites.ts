import { useGetPendingSquadInvitesQuery } from "@/rtkQuery/API/squadApi";

// Query for fetching pending invites of a squad
export const useSquadInvites = (squadId?: string) =>
  useGetPendingSquadInvitesQuery(squadId ?? "", {
    skip: !squadId,
    refetchOnMountOrArgChange: true,
  });
