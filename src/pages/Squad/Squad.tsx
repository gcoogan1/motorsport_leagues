import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { getSquadByIdThunk } from "@/store/squads/squad.thunk";
import { usePanel } from "@/providers/panel/usePanel";
import { navigate } from "@/app/navigation/navigation";
import { getBannerVariants } from "@/components/Banner/Banner.variants";
import { useSquadMembers } from "@/hooks/rtkQuery/queries/useSquadMembers";
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
import { useSquadPageReadyState } from "@/hooks/useSquadPageReadyState";
import { useSquadFounderContext } from "@/hooks/useSquadFounderContext";
import { useSquadHostedLeagues } from "@/hooks/rtkQuery/queries/useLeagues";

const Squad = () => {
  const { openPanel } = usePanel();
  const { openModal, closeModal } = useModal();
  const { squadId, token } = useParams<{ squadId: string; token: string }>();
  const dispatch = useDispatch<AppDispatch>();

  // Redux
  const accountId = useSelector((state: RootState) => state.account.data?.id);
  const currentUserProfiles = useSelector(
    (state: RootState) => state.profile.data ?? []
  );
  const currentProfileId = useSelector(
    (state: RootState) => state.profile.currentProfile?.id
  );
  const squad = useSelector((state: RootState) => state.squad.currentSquad);
  const userHasActiveProfile = useSelector(selectHasProfiles);

  // NEW READY STATE
  const { isReady, squadStatus, viewType } = useSquadPageReadyState();

  // RTK Query
  const { data: squadMembers = [] } = useSquadMembers(squadId);
  const { data: hostedLeagues = [] } = useSquadHostedLeagues(squadId);
  const { data: followers = [] } = useSquadFollowers(squadId ?? "");
  const { data: isFollowing = false } = useIsFollowingSquad(
    squadId ?? "",
    accountId ?? ""
  );

  // Build a quick lookup of the logged-in account's profile ids.
  const currentUserProfileIds = new Set(currentUserProfiles.map((profile) => profile.id));

  // Profile ids (owned by this account) that are members of the current squad.
  const memberProfileIdsInSquad = squadMembers
    .filter((member) => currentUserProfileIds.has(member.profile_id))
    .map((member) => member.profile_id);

  // Set used to map those member ids back to full profile objects.
  const memberProfileIdSet = new Set(memberProfileIdsInSquad);

  // Full profile rows for account-owned profiles that are squad members (used by leave picker).
  const viewerMemberProfiles = currentUserProfiles.filter((profile) =>
    memberProfileIdSet.has(profile.id),
  );

  // True when at least one of the account's profiles is already in the squad.
  const userAlreadyInSquad = memberProfileIdsInSquad.length > 0;

  // Default profile id for single-member flow: prefer active profile, otherwise first match.
  const viewerMemberProfileId =
    memberProfileIdsInSquad.length === 1
      ? memberProfileIdsInSquad[0]
      : currentProfileId && memberProfileIdsInSquad.includes(currentProfileId)
        ? currentProfileId
        : memberProfileIdsInSquad[0];

  // Invite flow
  useSquadInviteTokenFlow({
    squadId,
    token,
    viewType,
    userHasActiveProfile,
    squadStatus,
  });

  // Load squad
  useEffect(() => {
    if (squadId) {
      dispatch(getSquadByIdThunk(squadId));
    }
  }, [squadId, dispatch]);

  // Redirect invalid
  useEffect(() => {
    if (!squadId) {
      navigate("/unavailable", { replace: true });
      return;
    }

    if (squadStatus === "rejected") {
      navigate("/unavailable", { replace: true });
    }
  }, [squadId, squadStatus]);

  const hasStoredInvite = useRef(false);

  useEffect(() => {
    if (!isReady || !token || hasStoredInvite.current) return;

    const shouldStore =
      viewType === "guest" ||
      (viewType === "user" && userHasActiveProfile === false) ||
      (viewType === "user" && !userAlreadyInSquad);

    if (shouldStore) {
      localStorage.setItem(
        "squad_invite",
        JSON.stringify({
          token,
          timestamp: Date.now(),
          squadId,
        })
      );
    }

    hasStoredInvite.current = true;
  }, [isReady, token, viewType, userAlreadyInSquad, squadId, userHasActiveProfile]);

  const {
    isViewerFounder,
    inviterFounderUsername,
    inviterFounderProfileId,
    inviterFounderAccountId,
  } = useSquadFounderContext({
    squadMembers,
    currentUserProfiles,
    currentProfileId,
  });

  if (!isReady || !squad || squad.id !== squadId) {
    return <LoadingScreen />;
  }

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

  // -- Handlers -- //
  const handleEditSquad = () => openPanel("SQUAD_EDIT");

  const handleOnFollowersClick = () => {
    openPanel("SQUAD_FOLLOWERS", { squadId: squad.id });
  };

  const onMembersClick = () => {
    openPanel("SQUAD_MEMBERS", { squadId: squad.id });
  };

  const handleOnShareSquad = () => {
    openModal(
      <ShareSquad squadUrl={window.location.href} onClose={closeModal} />
    );
  };

  const handleInviteToSquad = () => {
    if (!isViewerFounder) return;

    openModal(
      <InviteSquad
        squadId={squad.id}
        squadName={squad.squad_name}
        founderName={inviterFounderUsername}
        founderProfileId={inviterFounderProfileId}
        founderAccountId={inviterFounderAccountId}
      />
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
        viewType={viewType === "loading" ? "guest" : viewType}
        viewerProfileId={viewerMemberProfileId}
        viewerMemberProfiles={viewerMemberProfiles}
        followersCount={followers.length}
        hasProfile={userHasActiveProfile ?? false}
        onFollowersClick={handleOnFollowersClick}
        onMembersClick={onMembersClick}
        onEdit={handleEditSquad}
        onShare={handleOnShareSquad}
        onInvite={handleInviteToSquad}
      />
      <Contents>
        <Container>
          <LeaguesListCard
            leagues={hostedLeagues}
            currentUserId={accountId}
            squadPageView={true}
          />
        </Container>
      </Contents>
    </Wrapper>
  );
};

export default Squad;