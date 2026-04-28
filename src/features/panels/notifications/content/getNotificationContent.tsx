import type { Notification } from "@/types/notification.types";

export type NotificationHandlers = {
  onJoinSquad: (notification: Notification) => void;
  onRejectSquad: (notification: Notification) => void;
  onDismiss?: (notification: Notification) => void;
}

export const getNotificationContent = (notification: Notification, handlers: NotificationHandlers) => {
  if (notification.type === "INVITE_RECEIVED") {
    if (notification.entity_type === "squad_invite") {  
      const invitedUser = notification.metadata.receiver_profile_username ? `${notification.metadata.receiver_profile_username} has` : "You have";    
      return {
        title: "Squad Invitation",
        message: `${invitedUser} been invited by ${notification.metadata.sender_username} to join the ${notification.metadata.squad_name} Squad.`,
        actionRight : {
          label: "Join Squad",
          color: "system",
          action: () => {
            handlers.onJoinSquad(notification);
          },
        },
        actionLeft: {
          label: "Reject",
          color: "danger",
          action: () => {
            handlers.onRejectSquad(notification);
          },
        },
      };
    }
  }

  if (notification.type === "INVITE_ACCEPTED") {
    if (notification.entity_type === "squad_invite") {
      const acceptedUser = notification.metadata.recipient_email ? notification.metadata.recipient_email
        : notification.metadata.recipient_username
          ? notification.metadata.recipient_username
          : "A user";

      return {
        title: "Invite Accepted",
        message: `${acceptedUser} has accepted your squad invite for ${notification.metadata.squad_name}.`,
        actionRight : {
          label: "Dismiss",
          color: "base",
          action: () => {
            handlers.onDismiss?.(notification);
          }
      }  
    };
    }
  }

  if (notification.type === "ANNOUNCEMENT") {
    return {
      title: "Announcement",
      message: notification.metadata.message,
    };
  }

  return {
    title: "Notification",
    message: "You have a new notification.",
  };
};