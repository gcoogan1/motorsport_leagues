import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectCurrentProfile, selectHasProfiles } from "@/store/profile/profile.selectors";
import { useCreateNotification } from "@/hooks/rtkQuery/mutations/useNotificationMutation";
import { getInviteTablesByToken } from "@/services/squad.service";
import { getNotificationsByRecipientId } from "@/services/notification.service";
import type { RootState } from "@/store";

/**
 * PENDING INVITE NOTIFICATION HOOK
 * 
 * FLOW:
    1. When a user clicks on a squad invite link, the invite token and related info are stored in localStorage under "squad_invite".
    2. After the user logs in and their profile(s) load, this hook checks for the presence of a pending invite in localStorage.
    3. If a pending invite exists, it fetches the invite details from the database using the token.
    4. If the invite is valid and hasn't already had a notification created for it, a new notification is created for the recipient profile about the pending invite.
    5. The localStorage entry for the pending invite is cleared to prevent duplicate notifications on future logins.

    This ensures that users receive notifications for squad invites that were sent while they were logged out, improving engagement and ensuring they don't miss important invites.
 */
export const usePendingInviteNotification = () => {
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const currentProfile = useSelector(selectCurrentProfile);
  const firstProfile = useSelector(
    (state: RootState) => state.profile.data?.[0] ?? null,
  );
  const hasProfile = useSelector(selectHasProfiles);
  const profileStatus = useSelector((state: RootState) => state.profile.status);
  const [createNotification] = useCreateNotification();
  const hasRunRef = useRef(false);
  const recipientProfile = currentProfile ?? firstProfile;

  useEffect(() => {
    // Only run once per mount, and only after login + profile creation + recipientProfile resolved
    // Also wait for profile loading to complete (status !== "loading")
    if (hasRunRef.current || !accountId || !hasProfile || !recipientProfile?.id || profileStatus === "loading") return;

    // Only run when a pending squad invite exists in localStorage.
    const inviteDataStr = localStorage.getItem("squad_invite");
    if (!inviteDataStr) return;

    console.log("1: Pending invite found in localStorage, processing notification...");

    hasRunRef.current = true;

    const checkAndNotifyPendingInvite = async () => {
      try {
        const inviteData = JSON.parse(inviteDataStr) as {
          token: string;
          timestamp: number;
          squadId: string;
        };

        // Fetch full invite details from database
        const inviteTableResult = await getInviteTablesByToken(inviteData.token);

        console.log("2: Invite details fetched from database:", inviteTableResult);

        // Invite no longer exists or expired, clean up localStorage
        if (!inviteTableResult.success || !inviteTableResult.data) {
          localStorage.removeItem("squad_invite");
          return;
        }

        const invite = inviteTableResult.data;

        // Skip notification if sender info is missing (required for valid UUID fields)
        if (!invite.sender_account_id || !invite.sender_profile_id) {
          console.warn("[usePendingInviteNotification] Missing sender info, skipping notification");
          localStorage.removeItem("squad_invite");
          return;
        }

        // Avoid duplicate notifications for the same invite entity.
        const existingNotificationsResult = await getNotificationsByRecipientId(
          recipientProfile.id,
        );

        if (existingNotificationsResult.success) {
          const alreadyExists = existingNotificationsResult.data.some(
            (notification) =>
              notification.type === "INVITE_RECEIVED" &&
              notification.entity_type === "squad_invite" &&
              notification.entity_id === invite.id,
          );

          if (alreadyExists) {
            console.log(
              "[usePendingInviteNotification] Invite notification already exists, skipping create",
            );
            localStorage.removeItem("squad_invite");
            return;
          }
        }

        // Create notification for the invitee about the pending invite
        await createNotification({
          recipient_profile_id: recipientProfile.id,
          sender_account_id: invite.sender_account_id,
          sender_profile_id: invite.sender_profile_id,
          entity_id: invite.id,
          type: "INVITE_RECEIVED",
          entity_type: "squad_invite",
          metadata: {
            squad_name: invite.squad_name,
            sender_username: invite.sender_username,
            invite_token: invite.token || inviteData.token, // Fallback to token from localStorage if not in DB (shouldn't happen but just in case)
          },
        }).unwrap();

      console.log("3: Notification created successfully");

        // Clear localStorage after successfully sending notification
        localStorage.removeItem("squad_invite");

        console.log("[usePendingInviteNotification] Notification sent for pending invite");
      } catch (error) {
        // Log error but don't throw—failure to notify shouldn't break the app
        console.error("[usePendingInviteNotification] Failed to process pending invite:", error);
      }
    };

    void checkAndNotifyPendingInvite();
  }, [accountId, recipientProfile?.id, hasProfile, profileStatus, createNotification]);
};
