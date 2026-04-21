import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { getLeagueByIdThunk } from "@/store/leagues/league.thunk";
import { useModal } from "@/providers/modal/useModal";
import { useAppTheme } from "@/providers/theme/useTheme";
import { useLeagueParticipants } from "@/hooks/rtkQuery/queries/useLeagues";
import { useLeaguePageReadyState } from "@/hooks/useLeaguePageReadyState";
import Cover from "@/components/Structures/Cover/Cover";
import LoadingScreen from "@/components/Messages/LoadingScreen/LoadingScreen";
import { Wrapper } from "./League.styles";
import { getGuestActions, getParticipantActions } from "./League.actions";
import Game from "@/features/leagues/modals/core/Game/Game";
import HostSquad from "@/features/leagues/modals/core/HostSquad/HostSquad";
import ShareLeague from "@/features/leagues/modals/core/ShareLeague/ShareLeague";

// TODO: Update the League page to pull real data and implement actions

const League = () => {
  const { openModal, closeModal } = useModal();
  const { setOverrideThemeName, clearOverrideThemeName } = useAppTheme();
  const navigate = useNavigate();
  const { leagueId } = useParams<{ leagueId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const currentLeague = useSelector(
    (state: RootState) => state.league.currentLeague,
  );

  const { data: participants = [] } = useLeagueParticipants(currentLeague?.id);

  const { viewType, isDirector } = useLeaguePageReadyState();

  // Load league data
  useEffect(() => {
    if (leagueId) {
      dispatch(getLeagueByIdThunk(leagueId));
    }
  }, [leagueId, dispatch]);

  // Set theme color based on league settings
  useEffect(() => {
    if (!currentLeague?.theme_color) {
      return;
    }

    setOverrideThemeName(currentLeague.theme_color);

    return () => {
      clearOverrideThemeName();
    };
  }, [currentLeague?.theme_color, setOverrideThemeName, clearOverrideThemeName]);

  if (!currentLeague) {
    return <LoadingScreen />;
  }

  const isParticipantView = viewType === "participant";
  const isViewTypeLoading = viewType === "loading";
  const participantsCount = participants.length;

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

  const participantActions = getParticipantActions({
    isDirector,
    onManageLeague: () => {
      navigate(`/league/${currentLeague.id}/management`);
    },
    onShareLeague: handleShareLeague,
  });

  const guestActions = getGuestActions({
    onShareLeague: handleShareLeague,
  });

  return (
    <Wrapper>
      <Cover
        title={currentLeague.league_name}
        gameType={currentLeague.game_type}
        squadName={currentLeague.hosting_squad_name}
        description={currentLeague.description}
        participantsCount={participantsCount}
        followersCount={0}
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
