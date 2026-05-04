import { supabase } from "@/lib/supabase";
import type { GetLeagueInvitesResult, GetLeagueInviteTableResult, InviteLeaguePayload, InviteLeagueResult, MarkLeagueInviteClickedPayload, MarkLeagueInviteClickedResult, RemoveLeagueInviteByTokenResult } from "@/types/league.types";

// --- League Invite Service --- //

// -- Invite To League -- //
export const inviteToLeague = async (
  {
    emails,
    leagueId,
    leagueName,
    role,
    senderUsername,
    senderAccountId,
    senderProfileId,
  }: InviteLeaguePayload,
): Promise<InviteLeagueResult> => {
  const { data, error } = await supabase.functions.invoke(
    "invite-user-league",
    {
      body: {
        emails,
        leagueId,
        leagueName,
        role,
        senderUsername,
        senderAccountId,
        senderProfileId,
      },
    },
  );

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "INVITE_FAILED",
        status: 500,
      },
    };
  }

  return { success: true, data: data.data };
};

// -- Get League Invite Table by Token -- //
export const getLeagueInviteTableByToken = async (
  inviteToken: string,
): Promise<GetLeagueInviteTableResult> => {
  const { data, error } = await supabase
    .from("league_invites")
    .select("*")
    .eq("token", inviteToken)
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data,
  };
};

// -- Remove League Invite by Token -- //
export const removeLeagueInviteByToken = async (
  inviteToken: string,
): Promise<RemoveLeagueInviteByTokenResult> => {
  const { error } = await supabase
    .from("league_invites")
    .delete()
    .eq("token", inviteToken);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return { success: true };
};

// -- Mark League Invite as Clicked -- //
export const markLeagueInviteClicked = async (
  { inviteId, profileId }: MarkLeagueInviteClickedPayload,
): Promise<MarkLeagueInviteClickedResult> => {
  const { error } = await supabase
    .from("league_invites")
    .update({
      profile_id: profileId,
      status: "clicked",
      clicked_at: new Date().toISOString(),
    })
    .eq("id", inviteId)
    .eq("status", "pending")
    .is("clicked_at", null);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return { success: true };
};

// -- Get Pending League Invites by League ID -- //
export const getPendingLeagueInvitesByLeagueId = async (
  leagueId: string,
  signal?: AbortSignal,
): Promise<GetLeagueInvitesResult> => {
  let query = supabase
    .from("league_invites")
    .select("*")
    .eq("league_id", leagueId)
    .eq("status", "pending");

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } = await query;

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data,
  };
};