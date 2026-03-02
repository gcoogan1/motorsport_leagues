import { getAllSquads, getSquadMembersBySquadId } from "@/services/squad.service";
import type { GetSquadMembersResult, GetSquadsResult, SquadMemberProfile, SquadTable } from "@/types/squad.types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";


export type SquadQueryArgs = {
  founderAccountId?: string;
  search?: string;
  activeTab?: string;
}

export const squadApi = createApi({
  reducerPath: "squadApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Squads", "SquadMembers"],
  endpoints: (builder) => ({
    getSquads: builder.query<SquadTable[], SquadQueryArgs>({
      queryFn: async ({ founderAccountId, search }, api) => {
        const result: GetSquadsResult = await getAllSquads(
          founderAccountId,
          search,
          api.signal,
        );

        if (!result.success) {
          return {
            error: {
              status: result.error.status,
              data: result.error,
            },
          };
        }

        return { data: result.data };
      },
      providesTags: (_result, _error, args) => [
        { type: "Squads", id: `${args.activeTab ?? "all"}-${args.search ?? ""}` },
      ],
    }),
    getSquadMembers: builder.query<SquadMemberProfile[], string>({
      queryFn: async (squadId, api) => {
        const result: GetSquadMembersResult = await getSquadMembersBySquadId(
          squadId,
          api.signal,
        );

        if (!result.success) {
          return {
            error: {
              status: result.error.status,
              data: result.error,
            },
          };
        }

        return { data: result.data };
      },
      providesTags: (_result, _error, squadId) => [
        { type: "SquadMembers", id: squadId },
      ],
    }),
  }),
});

export const { useGetSquadsQuery, useGetSquadMembersQuery } = squadApi;