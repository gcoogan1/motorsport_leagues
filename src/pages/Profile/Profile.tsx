import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentProfile,
  selectHasProfiles,
  selectProfileViewType,
} from "@/store/profile/profile.selectors";
import { type AppDispatch } from "@/store";
import { usePanel } from "@/providers/panel/usePanel";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { navigate } from "@/app/navigation/navigation";
import { getProfileByProfileIdThunk } from "@/store/profile/profile.thunk";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import { useIsFollowingProfile, useProfileFollowers } from "@/hooks/rtkQuery/queries/useProfileFollowers";
import ProfileHeader from "@/components/Headers/ProfileHeader/ProfileHeader";
import ProfileStats from "@/components/ProfileStats/ProfileStats";
import SquadsListCard from "@/components/Cards/CardList/SquadsListCard/SquadsListCard";
import LeaguesListCard from "@/components/Cards/CardList/LeaguesListCard/LeaguesListCard";
import FollowProfile from "@/features/profiles/forms/Follow/FollowProfile";
import NoProfile from "@/features/profiles/modals/core/NoProfile/NoProfile";
import GuestFollow from "@/features/profiles/modals/errors/GuestFollow/GuestFollow";
import Unfollow from "@/features/profiles/modals/errors/Unfollow/Unfollow";
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
  const { openModal } = useModal();
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  // -- Selectors -- //
  const profile = useSelector(selectCurrentProfile);
  const viewType = useSelector(selectProfileViewType());
  const userHasActiveProfile = useSelector(selectHasProfiles);
  const fullGameName = profile?.game_type
    ? convertGameTypeToFullName(profile.game_type)
    : "";

  // -- RTK Query -- //
  // Fetch followers for this profile (used to display followers count and determine if current user is following this profile)
  const { data: followers = [] } = useProfileFollowers(profileId ?? "");
  // Check if the logged in user is following the profile being viewed (used to determine follow/unfollow behavior)
  const { data: isFollowing = false } = useIsFollowingProfile(user?.id ?? "", profileId ?? "");


  useEffect(() => {
    // If profileId exists in URL and it's different from the currently loaded profile, fetch the new profile
    if (profileId && profile?.id !== profileId) {
      dispatch(getProfileByProfileIdThunk(profileId));
    }
  }, [profileId, profile?.id, dispatch]);

  // If no profile found for the given profileId, navigate to unavailable page
  if (!profileId) {
    navigate("/unavailable");
    return;
  }

  // -- Handlers -- //

  const handleEditProfile = () => {
    openPanel("PROFILE_EDIT");
  };

  const handleGoToFollowers = () => {
    openPanel("PROFILE_FOLLOWERS", { profileId });
  }

  const handleMemberFollow = () => {
    if (user?.id && isFollowing) {
      openModal(<Unfollow profileId={profileId} userId={user?.id} />);
      return;
    }

    if (user?.id && userHasActiveProfile) {
      openModal(<FollowProfile userId={user.id} profileIdToFollow={profileId} />);
      return;
    }

    openModal(<NoProfile />);
    return;
  }

  const handleGuestFollow = () => {
    openModal(<GuestFollow />);
    return;
  }

  return (
    <Wrapper>
      <ProfileHeader
        gameType={fullGameName}
        username={profile?.username ?? ""}
        viewType={viewType}
        editOnClick={handleEditProfile}
        avatarType={profile?.avatar_type ?? "preset"}
        avatarValue={profile?.avatar_value ?? "none"}
        followersCount={followers.length}
        isFollowing={isFollowing}
        followersOnClick={handleGoToFollowers}
        onMemberFollow={handleMemberFollow}
        onGuestFollow={handleGuestFollow}
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
