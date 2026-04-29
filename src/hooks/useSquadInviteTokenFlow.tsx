import { useEffect, useRef } from "react";
import { getInviteTablesByToken } from "@/services/squad/squadInvite.service";
import { getNotificationsByRecipientIds } from "@/services/notification.service";
import type { SquadViewType } from "@/types/squad.types";
import { useModal } from "@/providers/modal/useModal";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import JoinSquad from "@/features/squads/modals/core/JoinSquad/JoinSquad";
import GuestJoinSquad from "@/features/squads/modals/errors/GuestJoinSquad/GuestJoinSquad";

type UseSquadInviteTokenFlowProps = {
  viewType: SquadViewType | "loading";
  userHasActiveProfile: boolean | null;
  squadStatus: "idle" | "loading" | "fulfilled" | "rejected";
  squadId?: string;
  token?: string;
};

export const useSquadInviteTokenFlow = ({
  viewType,
  userHasActiveProfile,
  squadStatus,
  squadId,
  token,
}: UseSquadInviteTokenFlowProps) => {
  const { openModal } = useModal();
  const dismissedInviteTokensRef = useRef<Set<string>>(new Set());
  const openedInviteTokensRef = useRef<Set<string>>(new Set());
  const myProfileIds = useSelector(
    (state: RootState) => state.profile.data?.map((profile) => profile.id) ?? [],
  );

useEffect(() => {
  const loadInviteData = async () => {
    // ABORT if we don't have a token or if state is still resolving
    if (!token || !viewType || viewType === "loading" || squadStatus !== "fulfilled") {
      return;
    }

    if (dismissedInviteTokensRef.current.has(token)) {
      return;
    }

    // Guard against duplicate modal opens from repeated effect runs
    if (openedInviteTokensRef.current.has(token)) {
      return;
    }

    if (!squadId) return;

    const inviteTableResult = await getInviteTablesByToken(token);
    if (!inviteTableResult.success) return;

    let existingNotificationId: string | undefined;

    if (myProfileIds.length > 0) {
      const notificationsResult = await getNotificationsByRecipientIds(myProfileIds);

      if (notificationsResult.success) {
        // If there's already a notification associated with this invite token, pass its ID to the JoinSquad modal so that it can be marked as read/dismissed when the invite is accepted.
        // This is needed for when the user accepts an invite directely from the mail link and not from the notification panel
        const existingInviteNotification = notificationsResult.data.find(
          (notification) =>
            notification.type === "INVITE_RECEIVED" &&
            notification.entity_type === "squad_invite" &&
            "invite_token" in notification.metadata &&
            notification.metadata.invite_token === token,
        );

        existingNotificationId = existingInviteNotification?.id;
      }
    }

    if (viewType === "founder") return;

    
    if (viewType === "user" && (userHasActiveProfile === false)) {
      openedInviteTokensRef.current.add(token);
      openModal(
        <JoinSquad
          squadId={squadId}
          hasProfile={false}
          token={token}
          onCancel={() => {
            dismissedInviteTokensRef.current.add(token);
            openedInviteTokensRef.current.delete(token);
          }}
          notificationId={existingNotificationId}
          senderAccountId={inviteTableResult.data.sender_account_id}
          senderProfileId={inviteTableResult.data.sender_profile_id}
          squadName={inviteTableResult.data.squad_name}
        />,
      );
      return;
    }
    
    if (viewType === "guest") {
      openedInviteTokensRef.current.add(token);
      openModal(
        <GuestJoinSquad
          onCancel={() => {
            dismissedInviteTokensRef.current.add(token);
            openedInviteTokensRef.current.delete(token);
          }}
        />,
      );
      return;
    }

    openedInviteTokensRef.current.add(token);
    openModal(
      <JoinSquad
        squadId={squadId}
        hasProfile={true}
        token={token}
        onCancel={() => {
          dismissedInviteTokensRef.current.add(token);
          openedInviteTokensRef.current.delete(token);
        }}
        notificationId={existingNotificationId}
        profileId={inviteTableResult.data.profile_id}
        senderAccountId={inviteTableResult.data.sender_account_id}
        senderProfileId={inviteTableResult.data.sender_profile_id}
        squadName={inviteTableResult.data.squad_name}
      />,
    );
  };

  void loadInviteData();
}, [squadId, token, userHasActiveProfile, viewType, squadStatus, openModal, myProfileIds])}
