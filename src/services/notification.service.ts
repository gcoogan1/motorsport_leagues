import { supabase } from "@/lib/supabase";
import type {
  CreateNotificationPayload,
  CreateNotificationResult,
  GetNotificationsResult,
  GetUnreadNotificationsCountResult,
  MarkAllNotificationsReadPayload,
  MarkAllNotificationsReadResult,
  MarkNotificationReadPayload,
  MarkNotificationReadResult,
  Notification,
} from "@/types/notification.types";

export const getNotificationsByRecipientId = async (
  recipientId: string,
): Promise<GetNotificationsResult> => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_profile_id", recipientId)
    .order("created_at", { ascending: false });

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
    data: (data ?? []) as Notification[],
  };
};

export const getNotificationsByRecipientIds = async (
  recipientIds: string[],
): Promise<GetNotificationsResult> => {
  if (!recipientIds.length) {
    return {
      success: true,
      data: [],
    };
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .in("recipient_profile_id", recipientIds)
    .order("created_at", { ascending: false });

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
    data: (data ?? []) as Notification[],
  };
};

export const getUnreadNotificationsCount = async (
  recipientId: string,
): Promise<GetUnreadNotificationsCountResult> => {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_profile_id", recipientId)
    .eq("is_read", false);

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
    data: count ?? 0,
  };
};

export const createNotification = async (
  notificationData: CreateNotificationPayload,
): Promise<CreateNotificationResult> => {
  const { data, error } = await supabase
    .from("notifications")
    .insert(notificationData)
    .select()
    .single<Notification>();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error?.code || "SERVER_ERROR",
        status: 500, // Supabase insert errors do not have status codes
      },
    };
  }

  return {
    success: true,
    data,
  };
};

export const markNotificationRead = async (
  { notificationId }: MarkNotificationReadPayload,
): Promise<MarkNotificationReadResult> => {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single<Notification>();

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

export const markAllNotificationsRead = async (
  { recipientProfileId }: MarkAllNotificationsReadPayload,
): Promise<MarkAllNotificationsReadResult> => {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("recipient_profile_id", recipientProfileId)
    .eq("is_read", false);

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
  };
};