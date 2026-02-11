import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentProfile,
  selectProfileViewType,
} from "@/store/profile/profile.selectors";
import { type AppDispatch } from "@/store";
import { usePanel } from "@/providers/panel/usePanel";
import { getProfileByProfileIdThunk } from "@/store/profile/profile.thunk";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import ProfileHeader from "@/components/Headers/ProfileHeader/ProfileHeader";
import ProfileStats from "@/components/ProfileStats/ProfileStats";
import SquadsListCard from "@/components/Cards/CardList/SquadsListCard/SquadsListCard";
import LeaguesListCard from "@/components/Cards/CardList/LeaguesListCard/LeaguesListCard";
import { Container, Content, ListContainer, Wrapper } from "./Profile.styles";

// TEMP HARDCODED STATS
const stats = [
  {
    number: 0,
    labelStat: "Leagues",
    labelFact: "Joined",
  },
  {
    number: 0,
    labelStat: "Seasons",
    labelFact: "Entered",
  },
  {
    number: 0,
    labelStat: "Rounds",
    labelFact: "Completed",
  },
  {
    number: 0,
    labelStat: "Races",
    labelFact: "Won",
  },
];

const Profile = () => {
  const { profileId } = useParams();
  const { openPanel } = usePanel();
  const dispatch = useDispatch<AppDispatch>();

  const profile = useSelector(selectCurrentProfile);
  const viewType = useSelector(selectProfileViewType());
  const fullGameName = profile?.game_type
    ? convertGameTypeToFullName(profile.game_type)
    : "";

  useEffect(() => {
    // If profileId exists in URL and it's different from the currently loaded profile, fetch the new profile
    if (profileId && profile?.id !== profileId) {
      dispatch(getProfileByProfileIdThunk(profileId));
    }
  }, [profileId, profile?.id, dispatch]);

  const handleEditProfile = () => {
    openPanel("PROFILE_EDIT");
  };

  return (
    <Wrapper>
      <ProfileHeader
        gameType={fullGameName}
        username={profile?.username ?? ""}
        viewType={viewType}
        editOnClick={handleEditProfile}
        avatarType={profile?.avatar_type ?? "preset"}
        avatarValue={profile?.avatar_value ?? "none"}
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
