import { supabase } from "@/lib/supabase";
import type {
  GetInviteTableResult,
  GetSquadInvitesResult,
  InviteSquadPayload,
  InviteSquadResult,
  MarkSquadInviteClickedPayload,
  MarkSquadInviteClickedResult,
  RemoveSquadInviteByTokenResult,
} from "@/types/squad.types";
import { FunctionsHttpError } from "@supabase/supabase-js";

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
    if (error instanceof FunctionsHttpError) {
      const errorMessage = await error.context.json();

      if (
        errorMessage &&
        errorMessage.error ===
          `duplicate key value violates unique constraint "unique_pending_invite_profile"`
      ) {
        return {
          success: false,
          error: {
            message: "A pending invite for this profile already exists.",
            code: "DUPLICATE_INVITE",
            status: 400,
          },
        };
      }
    }
  }

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

// -- Get Invite Table by Token -- //
export const getInviteTableByToken = async (
  inviteToken: string,
): Promise<GetInviteTableResult> => {
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
