import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import ProfileHeader from "@/components/Headers/ProfileHeader/ProfileHeader";
import { Container, Content, ListContainer, Wrapper } from "./Profile.styles";
import {
  selectCurrentProfile,
  selectProfileViewType,
} from "@/store/profile/profile.selectors";
import { useEffect } from "react";
import type { AppDispatch } from "@/store";
import { getProfileByProfileIdThunk } from "@/store/profile/profile.thunk";
import ProfileStats from "@/components/ProfileStats/ProfileStats";
import SquadsListCard from "@/components/Cards/CardList/SquadsListCard/SquadsListCard";
import LeaguesListCard from "@/components/Cards/CardList/LeaguesListCard/LeaguesListCard";

// TEMP HARDCODED STATS
const stats = [
  {
    number: 0,
    label: "Leagues Joined",
  },
  {
    number: 0,
    label: "Seasons Entered",
  },
  {
    number: 0,
    label: "Rounds Completed",
  },
  {
    number: 0,
    label: "Races Won",
  }
]

const Profile = () => {
  const { profileId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const profile = useSelector(selectCurrentProfile);
  const viewType = useSelector(selectProfileViewType());

useEffect(() => {
  // If profileId exists in URL and it's different from the currently loaded profile, fetch the new profile
  if (profileId && profile?.id !== profileId) {
    dispatch(getProfileByProfileIdThunk(profileId));
  }
}, [profileId, profile?.id, dispatch]);

  return (
    <Wrapper>
      <ProfileHeader
        gameType={profile?.game_type ?? ""}
        username={profile?.username ?? ""}
        viewType={viewType}
        editOnClick={() => console.log("Edit profile")}
        avatarType={profile?.avatar_type ?? "preset"}
        avatarValue={profile?.avatar_value ?? "black"}
        followersCount={0}
      />
      <Content>
        <Container>
          <ProfileStats stats={stats} />
          <ListContainer>
            <SquadsListCard />
            <LeaguesListCard />
          </ListContainer>
        </Container>
      </Content>
    </Wrapper>
  );
};

export default Profile;
