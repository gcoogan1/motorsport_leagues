import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  type AddLeagueApplicationOptionsPayload,
  type AddLeagueApplicationOptionsResult,
  type AddLeagueParticipantPayload,
  type AddLeagueParticipantResult,
  type AddLeagueParticipantRolePayload,
  type AddLeagueParticipantRoleResult,
  type CreateLeagueJoinRequestPayload,
  type CreateLeagueJoinRequestResult,
  type CreateLeagueSeasonDriverPayload,
  type CreateLeagueSeasonDriverResult,
  type CreateLeagueSeasonPayload,
  type CreateLeagueSeasonResult,
  type CreateLeagueSeasonTeamResult,
  type FollowLeaguePayload,
  type FollowLeagueResult,
  type GetLeagueApplicationOptionsResult,
  type GetLeagueFollowersResult,
  type GetLeagueFollowingResult,
  type GetLeagueInvitesResult,
  type GetLeagueJoinRequestsResult,
  type GetLeagueParticipantsResult,
  type GetLeagueSeasonDivisionByIdResult,
  type GetLeagueSeasonDivisionsResult,
  type GetLeagueSeasonDriversResult,
  type GetLeagueSeasonsResult,
  type GetLeagueSeasonTeamsResult,
  type GetLeaguesWithInfoResult,
  type JoinLeagueWithRolesPayload,
  type JoinLeagueWithRolesResult,
  type LeagueApplicationOptionsTable,
  type LeagueInviteTable,
  type LeagueJoinRequestWithProfile,
  type LeagueParticipantProfile,
  type LeagueSeasonDivisionTable,
  type LeagueSeasonDriverTable,
  type LeagueSeasonTable,
  type LeagueSeasonTeamTable,
  type LeagueTable,
  type LeagueWithInfo,
  type RemoveLeagueApplicationOptionsPayload,
  type RemoveLeagueApplicationOptionsResult,
  type RemoveLeagueFollowerPayload,
  type RemoveLeagueFollowerResult,
  type RemoveLeagueInvitePayload,
  type RemoveLeagueInviteResult,
  type RemoveLeagueJoinRequestPayload,
  type RemoveLeagueJoinRequestResult,
  type RemoveLeagueParticipantPayload,
  type RemoveLeagueParticipantResult,
  type RemoveLeagueParticipantRolePayload,
  type RemoveLeagueParticipantRoleResult,
  type RemoveLeagueSeasonDriverPayload,
  type RemoveLeagueSeasonDriverResult,
  type RemoveLeagueSeasonPayload,
  type RemoveLeagueSeasonResult,
  type RemoveLeagueSeasonTeamPayload,
  type RemoveLeagueSeasonTeamResult,
  type UnfollowLeaguePayload,
  type UnfollowLeagueResult,
  type UpdateLeagueApplicationOptionsPayload,
  type UpdateLeagueApplicationOptionsResult,
  type UpdateLeagueSeasonDriverResult,
  type UpdateLeagueSeasonPayload,
  type UpdateLeagueSeasonResult,
  type UpdateLeagueSeasonTeamPayload,
  type UpdateLeagueSeasonTeamResult,
} from "@/types/league.types";
import type { ProfileTable } from "@/types/profile.types";
import type {
  AddLeagueRulesPayload,
  AddLeagueRulesResult,
  GetLeagueRulesResult,
  RulesTable,
  UpdateLeagueRulesPayload,
  UpdateLeagueRulesResult,
} from "@/types/rules.types";
import {
  getAllLeaguesWithInfo,
  getLeaguesWithInfoByAccountId,
  getLeaguesWithInfoByProfileId,
  getLeaguesWithInfoBySquadId,
} from "@/services/league/league.service";
import {
  addLeagueApplicationOptions,
  getLeagueApplicationOptionsByLeagueId,
  removeLeagueApplicationOptions,
  updateLeagueApplicationOptions,
} from "@/services/league/leagueApplication.service";
import {
  followLeagueService,
  getFollowingLeagues,
  getLeagueFollowersService,
  isFollowingLeagueService,
  removeLeagueFollowerService,
  unfollowLeagueService,
} from "@/services/league/leagueFollow";
import {
  getPendingLeagueInvitesByLeagueId,
  removeLeagueInviteById,
} from "@/services/league/leagueInvite.service";
import {
  createLeagueJoinRequestService,
  getLeagueJoinRequestsByLeagueId,
  removeLeagueJoinRequestService,
} from "@/services/league/leagueJoinRequest.service";
import {
  addLeagueParticipant,
  addLeagueParticipantRole,
  getLeagueParticipantsByLeagueId,
  joinLeagueWithRolesService,
  removeLeagueParticipant,
  removeLeagueParticipantRole,
} from "@/services/league/leagueParticipant.service";
import {
  createLeagueSeason,
  getLeagueSeasonsByLeagueId,
  removeLeagueSeason,
  updateLeagueSeason,
} from "@/services/league/leagueSeason.service";
import {
  createLeagueSeasonDriver,
  getLeagueSeasonDriverById,
  getLeagueSeasonDriversByDivision,
  getLeagueSeasonDriversBySeasonId,
  removeLeagueSeasonDriver,
  updateLeagueSeasonDriverTeam,
} from "@/services/league/leagueSeasonDriver";
import {
  getLeagueSeasonDivisionByDivisionId,
  getLeagueSeasonDivisionsBySeasonId,
} from "@/services/league/leagueSeasonDivision.service";
import {
  createLeagueSeasonTeam,
  getLeagueSeasonTeamById,
  getLeagueSeasonTeamsByDivision,
  getLeagueSeasonTeamsBySeasonId,
  removeLeagueSeasonTeam,
  updateLeagueSeasonTeam,
} from "@/services/league/useSeasonTeam";
import {
  addLeagueRules,
  getLeagueRulesByLeagueId,
  updateLeagueRules,
} from "@/services/league/leagueRules.service";

export type LeaguesQueryArgs = {
  accountId?: string;
  search?: string;
  activeTab?: string;
  includeOwnLeagues?: boolean;
};

export const leagueApi = createApi({
  reducerPath: "leagueApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    "Leagues",
    "LeagueParticipants",
    "LeagueSeasons",
    "LeagueFollowers",
    "LeagueFollowing",
    "LeagueJoinRequests",
    "LeagueApplicationOptions",
    "LeagueInvites",
    "LeagueSeasonDivisions",
    "LeagueSeasonDrivers",
    "LeagueSeasonTeams",
    "LeagueRules",
  ],
  endpoints: (builder) => ({
    // GET Requests
    getLeagues: builder.query<LeagueWithInfo[], LeaguesQueryArgs>({
      queryFn: async ({ accountId, search, includeOwnLeagues }, api) => {
        try {
          const result: GetLeaguesWithInfoResult = await getAllLeaguesWithInfo(
            accountId,
            search,
            api.signal,
            includeOwnLeagues,
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
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, args) => [
        {
          type: "Leagues",
          id: `leagues-${args.activeTab ?? "all"}-${args.search ?? ""}-${
            args.includeOwnLeagues ? "include-own" : "exclude-own"
          }`,
        },
      ],
    }),
    getParticipantLeagues: builder.query<LeagueWithInfo[], string>({
      queryFn: async (accountId, api) => {
        try {
          const result: GetLeaguesWithInfoResult =
            await getLeaguesWithInfoByAccountId(accountId, api.signal);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, accountId) => [
        { type: "Leagues", id: `participant-leagues-${accountId}` },
      ],
    }),
    getLeaguesByProfileId: builder.query<LeagueWithInfo[], string>({
      queryFn: async (profileId, api) => {
        try {
          const result: GetLeaguesWithInfoResult =
            await getLeaguesWithInfoByProfileId(profileId, api.signal);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error,
          };
        }
      },
      providesTags: (_result, _error, profileId) => [
        { type: "Leagues", id: `profile-${profileId}` },
      ],
    }),
    getLeaguesBySquadId: builder.query<LeagueWithInfo[], string>({
      queryFn: async (squadId, api) => {
        try {
          const result: GetLeaguesWithInfoResult =
            await getLeaguesWithInfoBySquadId(squadId, api.signal);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error,
          };
        }
      },
      providesTags: (_result, _error, squadId) => [
        { type: "Leagues", id: `squad-${squadId}` },
      ],
    }),
    getLeagueParticipants: builder.query<LeagueParticipantProfile[], string>({
      queryFn: async (leagueId, api) => {
        try {
          const result: GetLeagueParticipantsResult =
            await getLeagueParticipantsByLeagueId(leagueId, api.signal);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, leagueId) => [
        { type: "LeagueParticipants", id: leagueId },
      ],
    }),
    getLeagueSeasons: builder.query<LeagueSeasonTable[], string>({
      queryFn: async (leagueId, api) => {
        try {
          const result: GetLeagueSeasonsResult =
            await getLeagueSeasonsByLeagueId(leagueId, api.signal);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, leagueId) => [
        { type: "LeagueSeasons", id: leagueId },
      ],
    }),
    getLeagueJoinRequests: builder.query<
      LeagueJoinRequestWithProfile[],
      string
    >({
      queryFn: async (leagueId, api) => {
        try {
          const result: GetLeagueJoinRequestsResult =
            await getLeagueJoinRequestsByLeagueId(leagueId, api.signal);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, leagueId) => [
        { type: "LeagueJoinRequests", id: leagueId },
      ],
    }),
    getLeagueApplicationOptions: builder.query<
      LeagueApplicationOptionsTable,
      string
    >({
      queryFn: async (leagueId) => {
        try {
          const result: GetLeagueApplicationOptionsResult =
            await getLeagueApplicationOptionsByLeagueId(leagueId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, leagueId) => [
        { type: "LeagueApplicationOptions", id: leagueId },
      ],
    }),
    getLeagueRules: builder.query<RulesTable | null, string>({
      queryFn: async (leagueId) => {
        try {
          const result: GetLeagueRulesResult =
            await getLeagueRulesByLeagueId(leagueId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, leagueId) => [
        { type: "LeagueRules", id: leagueId },
      ],
    }),
    getLeagueSeasonDivisions: builder.query<
      LeagueSeasonDivisionTable[],
      string
    >({
      queryFn: async (seasonId, api) => {
        try {
          const result: GetLeagueSeasonDivisionsResult =
            await getLeagueSeasonDivisionsBySeasonId(seasonId, api.signal);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, seasonId) => [
        { type: "LeagueSeasonDivisions", id: seasonId },
      ],
    }),
    getLeagueSeasonDivisionByDivisionId: builder.query<
      LeagueSeasonDivisionTable,
      string
    >({
      queryFn: async (divisionId) => {
        try {
          const result: GetLeagueSeasonDivisionByIdResult =
            await getLeagueSeasonDivisionByDivisionId(divisionId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, divisionId) => [
        { type: "LeagueSeasonDivisions", id: divisionId },
      ],
    }),
    getLeagueSeasonDriverById: builder.query<LeagueSeasonDriverTable, string>({
      queryFn: async (driverId) => {
        try {
          const result = await getLeagueSeasonDriverById(driverId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, driverId) => [
        { type: "LeagueSeasonDrivers", id: driverId },
      ],
    }),
    getLeagueSeasonDriversByDivision: builder.query<
      LeagueSeasonDriverTable[],
      string
    >({
      queryFn: async (divisionId, api) => {
        try {
          const result: GetLeagueSeasonDriversResult =
            await getLeagueSeasonDriversByDivision({
              divisionId,
              signal: api.signal,
            });

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, divisionId) => [
        { type: "LeagueSeasonDrivers", id: divisionId },
      ],
    }),
    getLeagueSeasonDriversBySeasonId: builder.query<
      LeagueSeasonDriverTable[],
      string
    >({
      queryFn: async (seasonId, api) => {
        try {
          const result: GetLeagueSeasonDriversResult =
            await getLeagueSeasonDriversBySeasonId({
              seasonId,
              signal: api.signal,
            });

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, seasonId) => [
        { type: "LeagueSeasonDrivers", id: seasonId },
      ],
    }),
    getLeagueSeasonTeamById: builder.query<LeagueSeasonTeamTable, string>({
      queryFn: async (teamId) => {
        try {
          const result = await getLeagueSeasonTeamById(teamId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, teamId) => [
        { type: "LeagueSeasonTeams", id: teamId },
      ],
    }),
    getLeagueSeasonTeamsByDivision: builder.query<
      LeagueSeasonTeamTable[],
      string
    >({
      queryFn: async (divisionId, api) => {
        try {
          const result: GetLeagueSeasonTeamsResult =
            await getLeagueSeasonTeamsByDivision({
              divisionId,
              signal: api.signal,
            });

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, divisionId) => [
        { type: "LeagueSeasonTeams", id: divisionId },
      ],
    }),
    getLeagueSeasonTeamsBySeasonId: builder.query<
      LeagueSeasonTeamTable[],
      string
    >({
      queryFn: async (seasonId, api) => {
        try {
          const result: GetLeagueSeasonTeamsResult =
            await getLeagueSeasonTeamsBySeasonId({
              seasonId,
              signal: api.signal,
            });

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, seasonId) => [
        { type: "LeagueSeasonTeams", id: seasonId },
      ],
    }),
    followLeague: builder.mutation<FollowLeagueResult, FollowLeaguePayload>({
      queryFn: async (payload) => {
        try {
          const result = await followLeagueService(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return {
            error,
          };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueFollowers", id: payload.leagueId },
        { type: "LeagueFollowing", id: payload.accountId },
      ],
    }),
    getLeagueFollowers: builder.query<ProfileTable[], string>({
      queryFn: async (leagueId) => {
        try {
          const result: GetLeagueFollowersResult =
            await getLeagueFollowersService(leagueId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error,
          };
        }
      },
      providesTags: (_result, _error, leagueId) => [
        { type: "LeagueFollowers", id: leagueId },
      ],
    }),
    getLeagueFollowing: builder.query<LeagueTable[], string>({
      queryFn: async (accountId) => {
        try {
          const result: GetLeagueFollowingResult =
            await getFollowingLeagues(accountId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error,
          };
        }
      },
      providesTags: (_result, _error, accountId) => [
        { type: "LeagueFollowing", id: accountId },
      ],
    }),
    isFollowingLeague: builder.query<
      boolean,
      { leagueId: string; accountId: string }
    >({
      queryFn: async ({ leagueId, accountId }) => {
        try {
          const data = await isFollowingLeagueService(leagueId, accountId);
          return { data };
        } catch (error) {
          return {
            error,
          };
        }
      },
      providesTags: (_result, _error, { leagueId, accountId }) => [
        { type: "LeagueFollowers", id: leagueId },
        { type: "LeagueFollowing", id: accountId },
      ],
    }),
    getPendingLeagueInvites: builder.query<LeagueInviteTable[], string>({
      queryFn: async (leagueId, api) => {
        try {
          const result: GetLeagueInvitesResult =
            await getPendingLeagueInvitesByLeagueId(leagueId, api.signal);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return {
            error,
          };
        }
      },
      providesTags: (_result, _error, leagueId) => [
        { type: "LeagueInvites", id: leagueId },
      ],
    }),

    // CREATE Requests
    createLeagueSeason: builder.mutation<
      CreateLeagueSeasonResult,
      CreateLeagueSeasonPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await createLeagueSeason(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueSeasons", id: payload.leagueId },
      ],
    }),
    addLeagueParticipant: builder.mutation<
      AddLeagueParticipantResult,
      AddLeagueParticipantPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await addLeagueParticipant(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueParticipants", id: payload.leagueId },
      ],
    }),
    addLeagueApplicationOptions: builder.mutation<
      AddLeagueApplicationOptionsResult,
      AddLeagueApplicationOptionsPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await addLeagueApplicationOptions(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueApplicationOptions", id: payload.leagueId },
      ],
    }),
    addLeagueRules: builder.mutation<
      AddLeagueRulesResult,
      AddLeagueRulesPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await addLeagueRules(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueRules", id: payload.leagueId },
      ],
    }),
    createLeagueJoinRequest: builder.mutation<
      CreateLeagueJoinRequestResult,
      CreateLeagueJoinRequestPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await createLeagueJoinRequestService(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueJoinRequests", id: payload.leagueId },
      ],
    }),
    joinLeagueWithRoles: builder.mutation<
      JoinLeagueWithRolesResult,
      JoinLeagueWithRolesPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await joinLeagueWithRolesService(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueParticipants", id: payload.leagueId },
        { type: "LeagueFollowers", id: payload.leagueId },
        { type: "LeagueFollowing", id: payload.accountId },
      ],
    }),
    addLeagueParticipantRole: builder.mutation<
      AddLeagueParticipantRoleResult,
      AddLeagueParticipantRolePayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await addLeagueParticipantRole(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: () => ["LeagueParticipants"],
    }),
    createLeagueSeasonDriver: builder.mutation<
      CreateLeagueSeasonDriverResult,
      CreateLeagueSeasonDriverPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await createLeagueSeasonDriver(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        "LeagueSeasonDrivers",
        { type: "LeagueSeasonDrivers", id: payload.divisionId },
      ],
    }),
    createLeagueSeasonTeam: builder.mutation<
      CreateLeagueSeasonTeamResult,
      {
        seasonId: string;
        divisionId: string;
        teamName: string;
      }
    >({
      queryFn: async (payload) => {
        try {
          const result = await createLeagueSeasonTeam(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        "LeagueSeasonTeams",
        { type: "LeagueSeasonTeams", id: payload.divisionId },
      ],
    }),

    // UPDATE Requests
    updateLeagueSeason: builder.mutation<
      UpdateLeagueSeasonResult,
      UpdateLeagueSeasonPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await updateLeagueSeason(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: () => ["LeagueSeasons"],
    }),
    updateLeagueApplicationOptions: builder.mutation<
      UpdateLeagueApplicationOptionsResult,
      UpdateLeagueApplicationOptionsPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await updateLeagueApplicationOptions(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueApplicationOptions", id: payload.leagueId },
      ],
    }),
    updateLeagueRules: builder.mutation<
      UpdateLeagueRulesResult,
      UpdateLeagueRulesPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await updateLeagueRules(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueRules", id: payload.leagueId },
      ],
    }),
    updateLeagueSeasonDriverTeam: builder.mutation<
      UpdateLeagueSeasonDriverResult,
      {
        driverId: string;
        teamId: string;
        addedToTeam?: string;
      }
    >({
      queryFn: async (payload) => {
        try {
          const result = await updateLeagueSeasonDriverTeam(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        "LeagueSeasonDrivers",
        { type: "LeagueSeasonDrivers", id: payload.driverId },
      ],
    }),
    updateLeagueSeasonTeam: builder.mutation<
      UpdateLeagueSeasonTeamResult,
      UpdateLeagueSeasonTeamPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await updateLeagueSeasonTeam(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        "LeagueSeasonTeams",
        { type: "LeagueSeasonTeams", id: payload.teamId },
      ],
    }),

    // DELETE Requests
    unfollowLeague: builder.mutation<
      UnfollowLeagueResult,
      UnfollowLeaguePayload
    >({
      queryFn: async (payload) => {
        try {
          const data = await unfollowLeagueService(payload);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueFollowers", id: payload.leagueId },
        { type: "LeagueFollowing", id: payload.accountId },
      ],
    }),
    removeLeagueFollower: builder.mutation<
      RemoveLeagueFollowerResult,
      RemoveLeagueFollowerPayload
    >({
      queryFn: async (payload) => {
        try {
          const data = await removeLeagueFollowerService(payload);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueFollowers", id: payload.leagueId },
        "LeagueFollowing",
      ],
    }),
    removeLeagueJoinRequest: builder.mutation<
      RemoveLeagueJoinRequestResult,
      RemoveLeagueJoinRequestPayload & { leagueId: string }
    >({
      queryFn: async ({ requestId }) => {
        try {
          const result = await removeLeagueJoinRequestService({ requestId });

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueJoinRequests", id: payload.leagueId },
      ],
    }),
    removeLeagueInvite: builder.mutation<
      RemoveLeagueInviteResult,
      RemoveLeagueInvitePayload
    >({
      queryFn: async ({ inviteId }) => {
        try {
          const result = await removeLeagueInviteById(inviteId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueInvites", id: payload.leagueId },
      ],
    }),
    removeLeagueParticipantRole: builder.mutation<
      RemoveLeagueParticipantRoleResult,
      RemoveLeagueParticipantRolePayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await removeLeagueParticipantRole(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: () => ["LeagueParticipants"],
    }),
    removeLeagueParticipant: builder.mutation<
      RemoveLeagueParticipantResult,
      RemoveLeagueParticipantPayload
    >({
      queryFn: async (payload, api) => {
        try {
          const result = await removeLeagueParticipant(payload, api.signal);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueParticipants", id: payload.leagueId },
      ],
    }),
    removeLeagueSeason: builder.mutation<
      RemoveLeagueSeasonResult,
      RemoveLeagueSeasonPayload
    >({
      queryFn: async (payload, api) => {
        try {
          const result = await removeLeagueSeason(payload, api.signal);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: () => ["LeagueSeasons"],
    }),
    removeLeagueApplicationOptions: builder.mutation<
      RemoveLeagueApplicationOptionsResult,
      RemoveLeagueApplicationOptionsPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await removeLeagueApplicationOptions(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueApplicationOptions", id: payload.leagueId },
      ],
    }),
    removeLeagueSeasonDriver: builder.mutation<
      RemoveLeagueSeasonDriverResult,
      RemoveLeagueSeasonDriverPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await removeLeagueSeasonDriver(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        "LeagueSeasonDrivers",
        { type: "LeagueSeasonDrivers", id: payload.driverId },
      ],
    }),
    removeLeagueSeasonTeam: builder.mutation<
      RemoveLeagueSeasonTeamResult,
      RemoveLeagueSeasonTeamPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await removeLeagueSeasonTeam(payload);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        "LeagueSeasonTeams",
        { type: "LeagueSeasonTeams", id: payload.teamId },
      ],
    }),
  }),
});

export const {
  useGetLeagueRulesQuery,
  useAddLeagueRulesMutation,
  useUpdateLeagueRulesMutation,
  useAddLeagueApplicationOptionsMutation,
  useAddLeagueParticipantMutation,
  useCreateLeagueJoinRequestMutation,
  useCreateLeagueSeasonDriverMutation,
  useGetLeagueSeasonDriverByIdQuery,
  useGetLeagueSeasonDriversByDivisionQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
  useUpdateLeagueSeasonDriverTeamMutation,
  useRemoveLeagueSeasonDriverMutation,
  useCreateLeagueSeasonTeamMutation,
  useGetLeagueSeasonTeamByIdQuery,
  useGetLeagueSeasonTeamsByDivisionQuery,
  useGetLeagueSeasonTeamsBySeasonIdQuery,
  useUpdateLeagueSeasonTeamMutation,
  useRemoveLeagueSeasonTeamMutation,
  useRemoveLeagueJoinRequestMutation,
  useRemoveLeagueInviteMutation,
  useJoinLeagueWithRolesMutation,
  useAddLeagueParticipantRoleMutation,
  useCreateLeagueSeasonMutation,
  useFollowLeagueMutation,
  useGetLeagueFollowersQuery,
  useGetLeagueFollowingQuery,
  useGetLeaguesQuery,
  useGetParticipantLeaguesQuery,
  useGetLeaguesByProfileIdQuery,
  useGetLeaguesBySquadIdQuery,
  useIsFollowingLeagueQuery,
  useGetLeagueParticipantsQuery,
  useGetLeagueApplicationOptionsQuery,
  useGetLeagueSeasonsQuery,
  useGetLeagueJoinRequestsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDivisionByDivisionIdQuery,
  useUnfollowLeagueMutation,
  useRemoveLeagueFollowerMutation,
  useRemoveLeagueApplicationOptionsMutation,
  useRemoveLeagueParticipantMutation,
  useRemoveLeagueParticipantRoleMutation,
  useRemoveLeagueSeasonMutation,
  useUpdateLeagueApplicationOptionsMutation,
  useUpdateLeagueSeasonMutation,
  useGetPendingLeagueInvitesQuery,
} = leagueApi;
