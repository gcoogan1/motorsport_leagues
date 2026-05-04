import { useEffect, useRef } from "react";
import { getLeagueInviteTableByToken } from "@/services/league/leagueInvite.service";
import { getNotificationsByRecipientIds } from "@/services/notification.service";
import { useModal } from "@/providers/modal/useModal";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { LeagueViewType } from "@/types/league.types";
import LeagueInvite from "@/features/leagues/modals/core/LeagueInvite/LeagueInvite";
import LeagueGuestFollow from "@/features/leagues/modals/errors/LeagueGuestFollow/LeagueGuestFollow";


type UseLeagueInviteTokenFlowProps = {
  viewType: LeagueViewType;
  userHasActiveProfile: boolean | null;
  leagueStatus: "idle" | "loading" | "fulfilled" | "rejected";
  leagueId?: string;
  token?: string;
};

export const useLeagueInviteTokenFlow = ({
  viewType,
  userHasActiveProfile,
  leagueStatus,
  leagueId,
  token,
}: UseLeagueInviteTokenFlowProps) => {
  const { openModal } = useModal();
  const dismissedInviteTokensRef = useRef<Set<string>>(new Set());
  const openedInviteTokensRef = useRef<Set<string>>(new Set());
  const myProfileIds = useSelector(
    (state: RootState) => state.profile.data?.map((profile) => profile.id) ?? [],
  );

useEffect(() => {
  const loadInviteData = async () => {
    // ABORT if we don't have a token or if state is still resolving
    if (!token || !viewType || viewType === "loading" || leagueStatus !== "fulfilled") {
      return;
    }

    if (dismissedInviteTokensRef.current.has(token)) {
      return;
    }

    // Guard against duplicate modal opens from repeated effect runs
    if (openedInviteTokensRef.current.has(token)) {
      return;
    }

    if (!leagueId) return;

    const inviteTableResult = await getLeagueInviteTableByToken(token);
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
            notification.entity_type === "league_invite" &&
            "invite_token" in notification.metadata &&
            notification.metadata.invite_token === token,
        );

        existingNotificationId = existingInviteNotification?.id;
      }
    }


    if (viewType === "user" && (userHasActiveProfile === false)) {
      openedInviteTokensRef.current.add(token);
      openModal(
        <LeagueInvite
          leagueId={leagueId}
          hasProfile={false}
          token={token}
          onCancel={() => {
            dismissedInviteTokensRef.current.add(token);
            openedInviteTokensRef.current.delete(token);
          }}
          notificationId={existingNotificationId}
          senderProfileId={inviteTableResult.data.sender_profile_id}
          leagueName={inviteTableResult.data.league_name}
          leagueRole={inviteTableResult.data.role}
        />,
      );
      return;
    }
    
    if (viewType === "guest") {
      openedInviteTokensRef.current.add(token);
      openModal(
        <LeagueGuestFollow type="join" />,
      );
      return;
    }

    openedInviteTokensRef.current.add(token);
    openModal(
      <LeagueInvite
        leagueId={leagueId}
        hasProfile={true}
        token={token}
        onCancel={() => {
          dismissedInviteTokensRef.current.add(token);
          openedInviteTokensRef.current.delete(token);
        }}
        notificationId={existingNotificationId}
        profileId={inviteTableResult.data.profile_id}
        senderProfileId={inviteTableResult.data.sender_profile_id}
        leagueName={inviteTableResult.data.league_name}
        leagueRole={inviteTableResult.data.role}
      />,
    );
    return;
  };

  void loadInviteData();
}, [leagueId, token, userHasActiveProfile, viewType, leagueStatus, openModal, myProfileIds])}
