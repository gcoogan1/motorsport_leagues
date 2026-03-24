// -- Notification Types -- //

// Constants //

export type NotificationType =
  | "INVITE_RECEIVED"
  | "INVITE_ACCEPTED"
  | "ANNOUNCEMENT";

export type EntityType = "squad" | "squad_invite" | "profile";

// Notification Metadata //

// INVITE_RECEIVED Metadata
export type InviteReceivedMetadata = {
  squad_name: string;
  sender_username: string;
  invite_token: string;
  receiver_profile_username?: string;
};

// INVITE_ACCEPTED Metadata
export type InviteAcceptedMetadata = {
  squad_name: string;
  recipient_email?: string;
  recipient_username: string;
};

// ANNOUNCEMENT Metadata
export type AnnouncementMetadata = {
  title: string;
  message: string;
};

// Supabase Types (and sub types) //

// Notification table --> shared fields stored in the "notifications" table
export interface NotificationBase {
  id: string;
  recipient_profile_id: string;
  sender_account_id: string;
  sender_profile_id: string;
  type: NotificationType;
  entity_type: EntityType;
  entity_id: string;
  created_at: string;
  is_read: boolean;
}

// Invite Received Notification --> notification row for squad invite receipt
export interface SquadInviteNotification extends NotificationBase {
  type: "INVITE_RECEIVED";
  entity_type: "squad_invite";
  metadata: InviteReceivedMetadata;
}

// Invite Accepted Notification --> notification row for accepted squad invite
export interface SquadInviteAcceptedNotification extends NotificationBase {
  type: "INVITE_ACCEPTED";
  entity_type: "squad_invite";
  metadata: InviteAcceptedMetadata;
}

// Announcement Notification --> notification row for general announcements
export interface AnnouncementNotification extends NotificationBase {
  type: "ANNOUNCEMENT";
  entity_type: "profile" | "squad";
  metadata: AnnouncementMetadata;
}

// Unified Notification Type for application use
export type Notification =
  | SquadInviteNotification
  | SquadInviteAcceptedNotification
  | AnnouncementNotification;

// -- Service Payloads and Results Types  --//

// Create Notification --> shared payload fields
interface CreateNotificationBase {
  recipient_profile_id: string;
  sender_account_id: string;
  sender_profile_id: string;
  entity_id: string;
  is_read?: boolean;
}

// Create Invite Received Notification --> payload type
export interface CreateInviteReceivedNotificationPayload
  extends CreateNotificationBase {
  type: "INVITE_RECEIVED";
  entity_type: "squad_invite";
  metadata: InviteReceivedMetadata;
}

// Create Invite Accepted Notification --> payload type
export interface CreateInviteAcceptedNotificationPayload
  extends CreateNotificationBase {
  type: "INVITE_ACCEPTED";
  entity_type: "squad_invite";
  metadata: InviteAcceptedMetadata;
}

// Create Announcement Notification --> payload type
export interface CreateAnnouncementNotificationPayload
  extends CreateNotificationBase {
  type: "ANNOUNCEMENT";
  entity_type: "profile" | "squad";
  metadata: AnnouncementMetadata;
}

export type CreateNotificationPayload =
  | CreateInviteReceivedNotificationPayload
  | CreateInviteAcceptedNotificationPayload
  | CreateAnnouncementNotificationPayload;

// Supabase Error Type --> used in notification service results
type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

// Create Notification --> Result type
export type CreateNotificationResult =
  | { success: true; data: Notification }
  | SupabaseError;

// Get Notifications --> Success type
export type GetNotificationsSuccess = {
  success: true;
  data: Notification[];
};

// Get Notifications --> Result type
export type GetNotificationsResult = GetNotificationsSuccess | SupabaseError;

// Get Unread Notifications Count --> Success type
export type GetUnreadNotificationsCountSuccess = {
  success: true;
  data: number;
};

// Get Unread Notifications Count --> Result type
export type GetUnreadNotificationsCountResult =
  | GetUnreadNotificationsCountSuccess
  | SupabaseError;

// Mark Notification Read --> Payload type
export type MarkNotificationReadPayload = {
  notificationId: string;
};

// Mark Notification Read --> Success type
export type MarkNotificationReadSuccess = {
  success: true;
  data: Notification;
};

// Mark Notification Read --> Result type
export type MarkNotificationReadResult =
  | MarkNotificationReadSuccess
  | SupabaseError;

// Mark All Notifications Read --> Payload type
export type MarkAllNotificationsReadPayload = {
  recipientProfileId: string;
};

// Mark All Notifications Read --> Success type
export type MarkAllNotificationsReadSuccess = {
  success: true;
};

// Mark All Notifications Read --> Result type
export type MarkAllNotificationsReadResult =
  | MarkAllNotificationsReadSuccess
  | SupabaseError;

// Legacy aliases kept to avoid breaking existing imports.
export type NOTIFICATION_TYPES = NotificationType;
export type ENTITY_TYPES = EntityType;