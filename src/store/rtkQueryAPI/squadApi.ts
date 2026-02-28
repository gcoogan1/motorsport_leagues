import { getAllSquads } from "@/services/squad.service";
import type { SquadTable, GetSquadsResult } from "@/types/squad.types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";


export type SquadQueryArgs = {
  founderAccountId?: string;
  search?: string;
  activeTab?: string;
}

export const squadApi = createApi({
  reducerPath: "squadApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Squads"],
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
  }),
});

export const { useGetSquadsQuery } = squadApi;