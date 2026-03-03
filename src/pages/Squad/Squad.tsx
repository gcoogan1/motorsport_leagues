import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { getSquadByIdThunk } from "@/store/squads/squad.thunk";
import { navigate } from "@/app/navigation/navigation";
import { getBannerVariants } from "@/components/Banner/Banner.variants";
import { useSquadMembers } from "@/hooks/rtkQuery/queries/useSquadMembers";
import { selectSquadViewType } from "@/store/squads/squad.selectors";
import { selectHasProfiles } from "@/store/profile/profile.selectors";
import SquadHeader from "@/components/Headers/SquadHeader/SquadHeader";
import LeaguesListCard from "@/components/Cards/CardList/LeaguesListCard/LeaguesListCard";
import { Container, Contents, Wrapper } from "./Squad.styles";
import { useSquadFollowers, useIsFollowingSquad } from "@/hooks/rtkQuery/queries/useSquadFollowers";

const Squad = () => {
  const { squadId } = useParams<{ squadId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const accountId = useSelector((state: RootState) => state.account.data?.id);
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
    // If the squadId from the URL params doesn't match the currently loaded squad, fetch the new squad data
    if (squadId && squad?.id !== squadId) {
      dispatch(getSquadByIdThunk(squadId));
    }
    if (squadStatus === "rejected") {
      navigate("/unavailable", { replace: true });
    }
  }, [squadId, squad?.id, dispatch, squadStatus]);


  if (!squad) {
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
        onEdit={() => console.log("Edit Squad")}
        onShare={() => console.log("Share Squad")}
        onInvite={() => console.log("Invite to Squad")}
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
