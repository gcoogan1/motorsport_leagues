import { supabase } from "@/lib/supabase";
import type { InviteSquadPayload, InviteSquadResult, GetInviteTablesResult, RemoveSquadInviteByTokenResult, MarkSquadInviteClickedPayload, MarkSquadInviteClickedResult, GetSquadInvitesResult } from "@/types/squad.types";

// --- Squad Invite Service --- //

// -- Invite To Squad -- //
export const inviteToSquad = async (
  {
    emails,
    squadId,
    squadName,
    senderUsername,
    senderAccountId,
    senderProfileId,
  }: InviteSquadPayload,
): Promise<InviteSquadResult> => {
  const { data, error } = await supabase.functions.invoke("invite_user", {
    body: {
      emails,
      squadId,
      squadName,
      senderUsername,
      senderAccountId,
      senderProfileId,
    },
  });

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

// -- Get Invite Tables by Token -- //
export const getInviteTablesByToken = async (
  inviteToken: string,
): Promise<GetInviteTablesResult> => {
  const { data, error } = await supabase
    .from("squad_invites")
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

// -- Remove Squad Invite by Token -- //
export const removeSquadInviteByToken = async (
  inviteToken: string,
): Promise<RemoveSquadInviteByTokenResult> => {
  const { error } = await supabase
    .from("squad_invites")
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

// -- Mark Squad Invite as Clicked -- //
export const markSquadInviteClicked = async (
  { inviteId, profileId }: MarkSquadInviteClickedPayload,
): Promise<MarkSquadInviteClickedResult> => {
  const { error } = await supabase
    .from("squad_invites")
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

// -- Get Pending Squad Invites by Squad ID -- //
export const getPendingSquadInvitesBySquadId = async (
  squadId: string,
  signal?: AbortSignal,
): Promise<GetSquadInvitesResult> => {
  let query = supabase
    .from("squad_invites")
    .select("*")
    .eq("squad_id", squadId)
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