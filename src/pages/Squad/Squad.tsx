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
import { useSquadFollowers, useIsFollowingSquad } from "@/hooks/rtkQuery/queries/useSquadFollowers";
import ShareSquad from "@/features/squads/forms/Share/ShareSquad/ShareSquad";
import { useModal } from "@/providers/modal/useModal";
import InviteSquad from "@/features/squads/forms/Invite/InviteSquad/InviteSquad";

const Squad = () => {
  const { openPanel } = usePanel();
  const { openModal, closeModal } = useModal();
  const { squadId } = useParams<{ squadId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const currentUserProfiles = useSelector((state: RootState) => state.profile.data ?? []);
  const squad = useSelector((state: RootState) => state.squad.currentSquad);
  const squadStatus = useSelector((state: RootState) => state.squad.status);
  const viewType = useSelector(selectSquadViewType());
  const userHasActiveProfile = useSelector(selectHasProfiles);
  const { data: squadMembers = [] } = useSquadMembers(squadId);

    // -- RTK Query -- //
    // Fetch followers for this squad (used to display followers count and determine if current user is following this squad)
    const { data: followers = [] } = useSquadFollowers(squadId ?? "");
    // Check if the logged in user is following the squad being viewed (used to determine follow/unfollow behavior)
    const { data: isFollowing = false } = useIsFollowingSquad(
      squadId ?? "",
      accountId ?? "",
    );
  

  useEffect(() => {
    if (squadId) {
      dispatch(getSquadByIdThunk(squadId));
    }
  }, [squadId, dispatch]);

  useEffect(() => {
    if (!squadId) {
      navigate("/unavailable", { replace: true });
      return;
    }

    if (squadStatus === "rejected") {
      navigate("/unavailable", { replace: true });
    }
  }, [squadId, squadStatus]);

  if (squadStatus === "loading") {
    return null;
  }

  if (!squadId || !squad || squad.id !== squadId) {
    return null;
  }

  const bannerImage =
    squad.banner_type === "preset"
      ? getBannerVariants()[squad.banner_value as keyof ReturnType<typeof getBannerVariants>]
      : squad.banner_value;

  const members = squadMembers.map((member) => ({
    id: member.id,
    avatarType: member.avatar_type,
    avatarValue: member.avatar_value,
  }));

  const founderUsername =
    currentUserProfiles.find(
      (profile) =>
        profile.id === squad.founder_profile_id && profile.account_id === accountId,
    )?.username ?? "";

  const handleEditSquad = () => {
    openPanel("SQUAD_EDIT");
  };

  const handleOnFollowersClick = () => {
    openPanel("SQUAD_FOLLOWERS", { squadId: squad.id });
  }

  const handleOnShareSquad = () => {
    openModal(<ShareSquad squadUrl={window.location.href} onClose={closeModal} />);
  }

  const handleInviteToSquad = () => {
    openModal(
      <InviteSquad
        squadId={squad.id}
        squadName={squad.squad_name}
        founderName={founderUsername}
      />,
    );
  }

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
