import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { getLeagueByIdThunk } from "@/store/leagues/league.thunk";
import { useModal } from "@/providers/modal/useModal";
import { useLeagueParticipants } from "@/hooks/rtkQuery/queries/useLeagueParticipants";
import { useLeaguePageReadyState } from "@/hooks/useLeaguePageReadyState";
import Cover from "@/components/Structures/Cover/Cover";
import FollowIcon from "@assets/Icon/Follow.svg?react";
import ShareIcon from "@assets/Icon/Share.svg?react";
import MoreIcon from "@assets/Icon/More_Vertical.svg?react";
import AnnouncementsIcon from "@assets/Icon/Announcements.svg?react";
import ChatIcon from "@assets/Icon/Chat.svg?react";
import LoadingScreen from "@/components/Messages/LoadingScreen/LoadingScreen";
import { Wrapper } from "./League.styles";
import Game from "@/features/leagues/modals/core/Game/Game";
import HostSquad from "@/features/leagues/modals/core/HostSquad/HostSquad";
import ShareLeague from "@/features/leagues/modals/core/ShareLeague/ShareLeague";

// TODO: Update the League page to pull real data and implement actions

const League = () => {
  const { openModal, closeModal } = useModal();
  const { leagueId } = useParams<{ leagueId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const currentLeague = useSelector(
    (state: RootState) => state.league.currentLeague,
  );

  const { data: participants = [] } = useLeagueParticipants(currentLeague?.id);

  const { viewType } = useLeaguePageReadyState();

  // Load league
  useEffect(() => {
    if (leagueId) {
      dispatch(getLeagueByIdThunk(leagueId));
    }
  }, [leagueId, dispatch]);

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
        tags={["director"]}
        optionalActions={
          isViewTypeLoading
            ? undefined
            : isParticipantView
              ? [
                  {
                    label: "Announcements",
                    color: "base",
                    leftIcon: <AnnouncementsIcon />,
                    onClick: () => {
                      console.log("Announcements clicked");
                    },
                  },
                  {
                    label: "Chat",
                    color: "base",

                    leftIcon: <ChatIcon />,
                    onClick: () => {
                      console.log("Chat clicked");
                    },
                  },
                  {
                    leftIcon: <ShareIcon />,
                    color: "base",
                    onClick: () => {
                      handleShareLeague();
                    },
                  },
                  {
                    leftIcon: <MoreIcon />,
                    color: "base",
                    onClick: () => {
                      console.log("More clicked");
                    },
                  },
                ]
              : [
                  {
                    label: "Join",
                    color: "primary",
                    onClick: () => {
                      console.log("Share clicked");
                    },
                  },
                  {
                    label: "Follow",
                    color: "base",
                    leftIcon: <FollowIcon />,
                    onClick: () => {
                      console.log("Follow clicked");
                    },
                  },
                  {
                    leftIcon: <ShareIcon />,
                    color: "base",
                    onClick: () => {
                      handleShareLeague();
                    },
                  },
                ]
        }
      />
    </Wrapper>
  );
};

export default League;
