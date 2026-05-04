import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import NotificationCard from "@/components/Cards/NotificationCard/NotificationCard";
import { useAllNotifications } from "@/rtkQuery/hooks/queries/useNotifications";
import { selectAllProfiles } from "@/store/profile/profile.selectors";
import Notifications from "@assets/Icon/Notifications.svg?react";
import { useSelector } from "react-redux";
import type { ComponentProps } from "react";
import type { Notification } from "@/types/notification.types";
import {
  getNotificationContent,
  type NotificationHandlers,
} from "./content/getNotificationContent";
import { useModal } from "@/providers/modal/useModal";
import JoinSquad from "@/features/squads/modals/core/JoinSquad/JoinSquad";
import JoinLeague from "@/features/leagues/modals/core/LeagueInvite/LeagueInvite";
import { withMinDelay } from "@/utils/withMinDelay";
import {
  getInviteTableByToken,
  removeSquadInviteByToken,
} from "@/services/squad/squadInvite.service";
import {
  getLeagueInviteTableByToken,
  removeLeagueInviteByToken,
} from "@/services/league/leagueInvite.service";
import { deleteNotification } from "@/services/notification.service";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useOtherProfiles } from "@/rtkQuery/hooks/queries/useProfiles";
import type { RootState } from "@/store";

type NotificationCardButtons = NonNullable<
  ComponentProps<typeof NotificationCard>["buttons"]
>;
type NotificationCardButton = NonNullable<NotificationCardButtons["left"]>;

const getNotificationTime = (notification: Notification) => {
  const createdAt = (notification as Notification & { created_at?: string })
    .created_at;

  if (!createdAt) return "";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";

  const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);

  const mins = Math.floor(secondsAgo / 60);
  const hours = Math.floor(secondsAgo / 3600);

  if (secondsAgo < 60) return `A few seconds ago`;
  if (secondsAgo < 3600) return `${mins} ${mins === 1 ? "min" : "mins"} ago`;
  if (secondsAgo < 43200) return `${hours} ${hours === 1 ? "hr" : "hrs"} ago`;

  return date.toLocaleDateString();
};

const NotificationsPanel = () => {
  const { openModal } = useModal();
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const myProfiles = useSelector(selectAllProfiles);
  const myProfileIds = myProfiles?.map((profile) => profile.id) ?? [];
  const { data: profiles = [] } = useOtherProfiles(accountId);

  const {
    data: notifications = [],
    isLoading,
    refetch: refetchNotifications,
  } = useAllNotifications(myProfileIds);

  const handlers: NotificationHandlers = {
    onJoinSquad: async (notification) => {
      const inviteToken =
        "invite_token" in notification.metadata
          ? notification.metadata.invite_token
          : "";
      // Retieve the profile attached to the invite table
      const inviteTableResult = await getInviteTableByToken(inviteToken);

      openModal(
        <JoinSquad
          squadId={notification.entity_id}
          token={inviteToken}
          hasProfile={true}
          profileId={
            inviteTableResult.success
              ? inviteTableResult.data.profile_id
              : undefined
          }
          notificationId={notification.id}
          senderAccountId={notification.sender_account_id}
          senderProfileId={notification.sender_profile_id}
          squadName={
            "squad_name" in notification.metadata
              ? notification.metadata.squad_name
              : undefined
          }
          onSuccess={() => {
            void refetchNotifications();
          }}
        />,
      );
      return;
    },
    onRejectSquad: async (notification) => {
      const inviteToken =
        "invite_token" in notification.metadata
          ? notification.metadata.invite_token
          : "";
      if (!inviteToken) return;

      try {
        await withMinDelay(
          (async () => {
            // REMOVE INVITE TOKEN
            const inviteRemovalResult =
              await removeSquadInviteByToken(inviteToken);
            if (!inviteRemovalResult.success) {
              throw inviteRemovalResult.error;
            }
            // REMOVE NOTIFICATION
            const removeNotificationResult = await deleteNotification(
              notification.id,
            );

            if (!removeNotificationResult.success) {
              throw removeNotificationResult.error;
            }

            // REFETCH NOTIFICATIONS TO UPDATE UI
            await refetchNotifications();
          })(),
          1000,
        );
        return;
      } catch {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
        return;
      }
    },
    onJoinLeague: async (notification) => {
      const inviteToken =
        "invite_token" in notification.metadata
          ? notification.metadata.invite_token
          : "";
      const inviteTableResult = await getLeagueInviteTableByToken(inviteToken);

      openModal(
        <JoinLeague
          leagueId={notification.entity_id}
          token={inviteToken}
          hasProfile={true}
          profileId={
            inviteTableResult.success
              ? inviteTableResult.data.profile_id
              : undefined
          }
          notificationId={notification.id}
          senderProfileId={notification.sender_profile_id}
          leagueName={
            "league_name" in notification.metadata
              ? notification.metadata.league_name
              : undefined
          }
          leagueRole={
            "league_role" in notification.metadata
              ? notification.metadata.league_role
              : undefined
          }
          onSuccess={() => {
            void refetchNotifications();
          }}
        />,
      );
      return;
    },
    onRejectLeague: async (notification) => {
      const inviteToken =
        "invite_token" in notification.metadata
          ? notification.metadata.invite_token
          : "";
      if (!inviteToken) return;

      try {
        await withMinDelay(
          (async () => {
            const inviteRemovalResult =
              await removeLeagueInviteByToken(inviteToken);
            if (!inviteRemovalResult.success) {
              throw inviteRemovalResult.error;
            }

            const removeNotificationResult = await deleteNotification(
              notification.id,
            );

            if (!removeNotificationResult.success) {
              throw removeNotificationResult.error;
            }

            await refetchNotifications();
          })(),
          1000,
        );
        return;
      } catch {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
        return;
      }
    },
    onDismiss: async (notification) => {
      try {
        await withMinDelay(
          (async () => {
            // DELETE NOTIFICATION
            const removeNotificationResult = await deleteNotification(
              notification.id,
            );

            if (!removeNotificationResult.success) {
              throw removeNotificationResult.error;
            }

            // REFETCH NOTIFICATIONS TO UPDATE UI
            await refetchNotifications();
          })(),
          1000,
        );
        return;
      } catch {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
        return;
      }
    },
  };

  return (
    <PanelLayout panelTitle="Notifications" panelTitleIcon={<Notifications />}>
      {isLoading ? (
        <EmptyMessage
          title="Loading Notifications"
          icon={<Notifications />}
          subtitle="Getting your latest notifications..."
        />
      ) : notifications.length === 0 ? (
        <EmptyMessage
          title="All Caught Up!"
          icon={<Notifications />}
          subtitle="You currently do not have any notifications."
        />
      ) : (
        notifications.map((notification) => {
          const content = getNotificationContent(notification, handlers);
          const buttons: NotificationCardButtons | undefined =
            content.actionLeft || content.actionRight
              ? {
                  left: content.actionLeft
                    ? {
                        label: content.actionLeft.label,
                        action: content.actionLeft.action,
                        color: content.actionLeft
                          .color as NotificationCardButton["color"],
                      }
                    : undefined,
                  right: content.actionRight
                    ? {
                        label: content.actionRight.label,
                        action: content.actionRight.action,
                        color: content.actionRight
                          .color as NotificationCardButton["color"],
                      }
                    : undefined,
                }
              : undefined;
          const senderProfile = profiles?.find(
            (profile) => profile.id === notification.sender_profile_id,
          );

          return (
            <NotificationCard
              key={notification.id}
              avatar={
                senderProfile
                  ? {
                      avatarType: senderProfile.avatar_type,
                      avatarValue: senderProfile.avatar_value,
                    }
                  : { avatarType: "preset", avatarValue: "email" }
              }
              title={content.title}
              message={content.message}
              time={getNotificationTime(notification)}
              buttons={buttons}
            />
          );
        })
      )}
    </PanelLayout>
  );
};

export default NotificationsPanel;
