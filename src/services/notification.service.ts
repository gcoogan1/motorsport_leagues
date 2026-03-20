import { supabase } from "@/lib/supabase";
import type {
  CreateNotificationPayload,
  CreateNotificationResult,
  GetNotificationsResult,
  GetUnreadNotificationsCountResult,
  // MarkAllNotificationsReadPayload,
  // MarkAllNotificationsReadResult,
  // MarkNotificationReadPayload,
  // MarkNotificationReadResult,
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

export const getNotificationById = async (notificationId: string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("id", notificationId)
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
  // Check if notification already exists to prevent duplicates
  // Match on: recipient, type, entity_type, entity_id, sender_profile_id
  const { data: existingNotifications, error: checkError } = await supabase
    .from("notifications")
    .select("id")
    .eq("recipient_profile_id", notificationData.recipient_profile_id)
    .eq("type", notificationData.type)
    .eq("entity_type", notificationData.entity_type)
    .eq("entity_id", notificationData.entity_id)
    .eq("sender_profile_id", notificationData.sender_profile_id);

  if (!checkError && existingNotifications && existingNotifications.length > 0) {
    // Notification already exists, return existing notification data instead of creating duplicate
    const { data: existingNotification, error: retrieveError } = await supabase
      .from("notifications")
      .select("*")
      .eq("id", existingNotifications[0].id)
      .single<Notification>();

    if (!retrieveError && existingNotification) {
      return {
        success: true,
        data: existingNotification,
      };
    }
  }

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

export const deleteNotification = async (notificationId: string) => {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

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

// export const markNotificationRead = async (
//   { notificationId }: MarkNotificationReadPayload,
// ): Promise<MarkNotificationReadResult> => {
//   const { data, error } = await supabase
//     .from("notifications")
//     .update({ is_read: true })
//     .eq("id", notificationId)
//     .select()
//     .single<Notification>();

//   if (error) {
//     return {
//       success: false,
//       error: {
//         message: error.message,
//         code: error.code || "SERVER_ERROR",
//         status: 500,
//       },
//     };
//   }

//   return {
//     success: true,
//     data,
//   };
// };

// export const markAllNotificationsRead = async (
//   { recipientProfileId }: MarkAllNotificationsReadPayload,
// ): Promise<MarkAllNotificationsReadResult> => {
//   const { error } = await supabase
//     .from("notifications")
//     .update({ is_read: true })
//     .eq("recipient_profile_id", recipientProfileId)
//     .eq("is_read", false);

//   if (error) {
//     return {
//       success: false,
//       error: {
//         message: error.message,
//         code: error.code || "SERVER_ERROR",
//         status: 500,
//       },
//     };
//   }

//   return {
//     success: true,
//   };
// };