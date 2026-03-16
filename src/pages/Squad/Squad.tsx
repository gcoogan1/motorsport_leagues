import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { getSquadByIdThunk } from "@/store/squads/squad.thunk";
import { usePanel } from "@/providers/panel/usePanel";
import { navigate } from "@/app/navigation/navigation";
import { getBannerVariants } from "@/components/Banner/Banner.variants";
import { useSquadMembers } from "@/hooks/rtkQuery/queries/useSquadMembers";
import { selectSquadViewType } from "@/store/squads/squad.selectors";
import { selectHasProfiles } from "@/store/profile/profile.selectors";
import SquadHeader from "@/components/Headers/SquadHeader/SquadHeader";
import LeaguesListCard from "@/components/Cards/CardList/LeaguesListCard/LeaguesListCard";
import { Container, Contents, Wrapper } from "./Squad.styles";
import {
  useSquadFollowers,
  useIsFollowingSquad,
} from "@/hooks/rtkQuery/queries/useSquadFollowers";
import ShareSquad from "@/features/squads/forms/Share/ShareSquad/ShareSquad";
import { useModal } from "@/providers/modal/useModal";
import { useSquadInviteTokenFlow } from "../../hooks/useSquadInviteTokenFlow";
import InviteSquad from "@/features/squads/forms/Invite/InviteSquad/InviteSquad";
import LoadingScreen from "@/components/Messages/LoadingScreen/LoadingScreen";

const Squad = () => {
  // -- Providers / navigation -- //
  const { openPanel } = usePanel();
  const { openModal, closeModal } = useModal();
  const { squadId } = useParams<{ squadId: string }>();
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();

  // -- Redux state -- //
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const currentUserProfiles = useSelector(
    (state: RootState) => state.profile.data ?? [],
  );
  const squad = useSelector((state: RootState) => state.squad.currentSquad);
  const squadStatus = useSelector((state: RootState) => state.squad.status);
  const viewType = useSelector(selectSquadViewType());
  const userHasActiveProfile = useSelector(selectHasProfiles);

  // -- RTK Query data -- //
  // Members power the squad header avatars and help derive founder metadata.
  const { data: squadMembers = [] } = useSquadMembers(squadId);

  // Followers count and follow-state are used by the header actions.
  const { data: followers = [] } = useSquadFollowers(squadId ?? "");
  const { data: isFollowing = false } = useIsFollowingSquad(
    squadId ?? "",
    accountId ?? "",
  );

  // -- Effects -- //
  useSquadInviteTokenFlow({ token, viewType, userHasActiveProfile, squadStatus });

  // Load the CURRENT SQUAD whenever the route changes.
  useEffect(() => {
    if (squadId) {
      dispatch(getSquadByIdThunk(squadId));
    }
  }, [squadId, dispatch]);

  // REDIRECT invalid or failed squad routes.
  useEffect(() => {
    if (!squadId) {
      navigate("/unavailable", { replace: true });
      return;
    }

    if (squadStatus === "rejected") {
      navigate("/unavailable", { replace: true });
    }
  }, [squadId, squadStatus]);

  // -- Conditional rendering -- //

  console.log("Squad page render", { squad, viewType, squadStatus });

  // SHOW loading state while determining the viewType (which depends on both account and squad state) to avoid flashing incorrect UI.
  if (squadStatus === "loading" || viewType === "loading") {
    return <LoadingScreen />;
  }

  if (!squad || squad.id !== squadId) {
    return <LoadingScreen />;
  }


  // -- Derived data -- //
  const bannerImage =
    squad.banner_type === "preset"
      ? getBannerVariants()[
          squad.banner_value as keyof ReturnType<typeof getBannerVariants>
        ]
      : squad.banner_value;

  const members = squadMembers.map((member) => ({
    id: member.id,
    avatarType: member.avatar_type,
    avatarValue: member.avatar_value,
  }));

  // FOUNDER username must come from the current user's own profile set,
  // matched directly against the squad's founder_profile_id.
  const founderUsername =
    currentUserProfiles.find(
      (profile) =>
        profile.id === squad.founder_profile_id &&
        profile.account_id === accountId,
    )?.username ?? "";


  // -- Handlers -- //
  const handleEditSquad = () => {
    openPanel("SQUAD_EDIT");
  };

  // Open the followers side panel for the current squad.
  const handleOnFollowersClick = () => {
    openPanel("SQUAD_FOLLOWERS", { squadId: squad.id });
  };

  // Open the share modal with the current page URL.
  const handleOnShareSquad = () => {
    openModal(
      <ShareSquad squadUrl={window.location.href} onClose={closeModal} />,
    );
  };

  // Open the invite modal with squad metadata and the resolved founder username.
  const handleInviteToSquad = () => {
    openModal(
      <InviteSquad
        squadId={squad.id}
        squadName={squad.squad_name}
        founderName={founderUsername}
      />,
    );
  };

  return (
    <Wrapper>
      <SquadHeader
        squadId={squad.id}
        squadName={squad.squad_name}
        viewerAccountId={accountId}
        isFollowing={isFollowing}
        bannerImage={bannerImage}
        members={members}
        viewType={viewType}
        followersCount={followers.length}
        hasProfile={userHasActiveProfile}
        onFollowersClick={handleOnFollowersClick}
        onEdit={handleEditSquad}
        onShare={handleOnShareSquad}
        onInvite={handleInviteToSquad}
      />
      <Contents>
        <Container>
          <LeaguesListCard />
        </Container>
      </Contents>
    </Wrapper>
  );
};

export default Squad;
