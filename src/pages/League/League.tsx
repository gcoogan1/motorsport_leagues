import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { getLeagueByIdThunk } from "@/store/leagues/league.thunk";
import { useModal } from "@/providers/modal/useModal";
import { usePanel } from "@/providers/panel/usePanel";
import { useAppTheme } from "@/providers/theme/useTheme";
import { useLeagueParticipants } from "@/rtkQuery/hooks/queries/useLeagues";
import { useLeaguePageReadyState } from "@/hooks/useLeaguePageReadyState";
import Cover from "@/components/Structures/Cover/Cover";
import LoadingScreen from "@/components/Messages/LoadingScreen/LoadingScreen";
import { Wrapper } from "./League.styles";
import { selectHasProfiles } from "@/store/profile/profile.selectors";
import { getGuestActions, getParticipantActions } from "./League.actions";
import Game from "@/features/leagues/modals/core/Game/Game";
import HostSquad from "@/features/leagues/modals/core/HostSquad/HostSquad";
import ShareLeague from "@/features/leagues/modals/core/ShareLeague/ShareLeague";
import LeagueGuestFollow from "@/features/leagues/modals/errors/LeagueGuestFollow/LeagueGuestFollow";
import LeagueNoProfile from "@/features/leagues/modals/core/LeagueNoProfile/LeagueNoProfile";
import FollowLeague from "@/features/leagues/forms/Follow/FollowLeague";
import {
  useIsFollowingLeague,
  useLeagueFollowers,
} from "@/rtkQuery/hooks/queries/useLeagueFollowers";
import UnfollowLeague from "@/features/leagues/modals/errors/UnfollowLeague/UnfollowLeague";
import LeaveLeague from "@/features/leagues/modals/core/LeaveLeague/LeaveLeague";
import InviteLeague from "@/features/leagues/forms/Invite/InviteLeague";
import { useLeagueDirectorContext } from "@/hooks/useLeagueDirectorContext";

// TODO: Update the League page to pull real data and implement actions

const League = () => {
  const { openModal, closeModal } = useModal();
  const { openPanel } = usePanel();
  const { setOverrideThemeName, clearOverrideThemeName } = useAppTheme();
  const navigate = useNavigate();
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const hasProfile = useSelector(selectHasProfiles);
  const { leagueId } = useParams<{ leagueId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data: followers = [] } = useLeagueFollowers(leagueId ?? "");
  const { data: isFollowing = false } = useIsFollowingLeague(
    leagueId ?? "",
    accountId ?? "",
  );
  const leagueStatus = useSelector((state: RootState) => state.league.status);

  const currentLeague = useSelector(
    (state: RootState) => state.league.currentLeague,
  );

  const { data: participants = [] } = useLeagueParticipants(currentLeague?.id);

  const { viewType, isDirector } = useLeaguePageReadyState();

  // Load league data
  useEffect(() => {
    if (leagueId && currentLeague?.id !== leagueId) {
      dispatch(getLeagueByIdThunk(leagueId));
    }
  }, [leagueId, currentLeague?.id, dispatch]);

  // Keep behavior consistent with other entity pages: redirect invalid/unavailable routes.
  useEffect(() => {
    if (!leagueId) {
      navigate("/unavailable", { replace: true });
      return;
    }

    if (leagueStatus === "rejected") {
      navigate("/unavailable", { replace: true });
    }
  }, [leagueId, leagueStatus, navigate]);

  // Set theme color based on league settings
  useEffect(() => {
    if (!currentLeague?.theme_color) {
      return;
    }

    setOverrideThemeName(currentLeague.theme_color);

    return () => {
      clearOverrideThemeName();
    };
  }, [
    currentLeague?.theme_color,
    setOverrideThemeName,
    clearOverrideThemeName,
  ]);

  const isLeagueLoading =
    !leagueId ||
    leagueStatus === "loading" ||
    !currentLeague ||
    currentLeague.id !== leagueId;

  // Get all user profiles from Redux (must be before any early return)
  const currentUserProfiles = useSelector((state: RootState) => state.profile.data ?? []);

  const isParticipantView = viewType === "participant";
  const isViewTypeLoading = viewType === "loading";
  const participantsCount = participants.length;
  const currentParticipant = participants.find(
    (participant) => participant.account_id === accountId,
  );

  // Use league director context (must be before any early return)
  const {
    inviterDirectorUsername,
    inviterDirectorProfileId,
    inviterDirectorAccountId,
  } = useLeagueDirectorContext({
    leagueParticipants: participants,
    currentUserProfiles,
    currentProfileId: currentParticipant?.profile_id,
  });

  if (isLeagueLoading) {
    return <LoadingScreen />;
  }

  // -- HANDLERS -- //
  const handleGameTypeClick = () => {
    openModal(<Game gameType={currentLeague.game_type} />);
  };

  const handleHostingSquadClick = () => {
    openModal(
      <HostSquad
        squadName={currentLeague.hosting_squad_name}
        squadId={currentLeague.hosting_squad_id}
      />,
    );
  };

  const handleShareLeague = () => {
    openModal(
      <ShareLeague
        leagueUrl={window.location.href}
        onClose={() => closeModal()}
      />,
    );
  };

  const handleFollowersClick = () => {
    openPanel("LEAGUE_FOLLOWERS", { leagueId: currentLeague.id });
  };

  const handleJoinLeague = () => {
    if (viewType === "guest" || !accountId) {
      return openModal(<LeagueGuestFollow type="join" />);
    }

    if (viewType === "user" && !hasProfile) {
      return openModal(<LeagueNoProfile type="join" />);
    }

    openPanel("LEAGUE_JOIN", { leagueId: currentLeague.id });
  };

  const handleFollowLeague = () => {
    if (viewType === "guest" || !accountId) {
      return openModal(<LeagueGuestFollow />);
    }

    if (viewType === "user" && !hasProfile) {
      return openModal(<LeagueNoProfile />);
    }

    if (isFollowing) {
      openModal(
        <UnfollowLeague leagueId={currentLeague.id} accountId={accountId} />,
      );
      return;
    }

    openModal(
      <FollowLeague
        leagueIdToFollow={currentLeague.id}
        accountId={accountId}
      />,
    );
    return;
  };

  const handleLeaveLeague = () => {
    if (!currentParticipant) {
      return;
    }

    openModal(
      <LeaveLeague
        leagueId={currentLeague.id}
        profileId={currentParticipant.profile_id}
      />,
    );
  };

  const handleParticipantsClick = () => {
    openPanel("LEAGUE_PARTICIPANTS", { leagueId: currentLeague.id });
  };

  // -- Action buttons based on view type -- //
  const participantActions = getParticipantActions({
    isDirector,
    onManageLeague: () => {
      navigate(`/league/${currentLeague.id}/management`);
    },
    onShareLeague: handleShareLeague,
    onLeaveLeague: handleLeaveLeague,
    onInviteParticipants: () => {
      openModal(
        <InviteLeague
          leagueId={currentLeague.id}
          leagueName={currentLeague.league_name}
          directorName={inviterDirectorUsername}
          directorProfileId={inviterDirectorProfileId}
          directorAccountId={inviterDirectorAccountId}
        />,
      );
    },
  });

  const guestActions = getGuestActions({
    onJoinLeague: handleJoinLeague,
    onShareLeague: handleShareLeague,
    onFollowLeague: handleFollowLeague,
    isFollowing,
  });

  return (
    <Wrapper>
      <Cover
        title={currentLeague.league_name}
        gameType={currentLeague.game_type}
        squadName={currentLeague.hosting_squad_name}
        description={currentLeague.description}
        participantsCount={participantsCount}
        followersCount={followers.length}
        onFollowersClick={handleFollowersClick}
        onParticipantsClick={handleParticipantsClick}
        onGameClick={handleGameTypeClick}
        onSquadNameClick={handleHostingSquadClick}
        backgroundImageUrl={currentLeague.cover_value}
        status={currentLeague.league_status}
        tags={isDirector ? ["director"] : []}
        optionalActions={
          isViewTypeLoading
            ? undefined
            : isParticipantView
              ? participantActions
              : guestActions
        }
      />
    </Wrapper>
  );
};

export default League;
