import { useGetPendingSquadInvitesQuery } from "@/store/rtkQueryAPI/squadApi";

// Query for fetching pending invites of a squad
export const useSquadInvites = (squadId?: string) =>
  useGetPendingSquadInvitesQuery(squadId ?? "", { skip: !squadId });
