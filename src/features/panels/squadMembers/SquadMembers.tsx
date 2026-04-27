import { useSelector } from "react-redux";
import { useAuth } from "@/providers/auth/useAuth";
import { useModal } from "@/providers/modal/useModal";
import { navigate } from "@/app/navigation/navigation";
import { usePanel } from "@/providers/panel/usePanel";
import {
  selectCurrentSquad,
  selectSquadViewType,
} from "@/store/squads/squad.selectors";
import type { Tag } from "@/components/Tags/Tags.variants";
import { useSquadMembers } from "@/hooks/rtkQuery/queries/useSquadMembers";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import FollowersIcon from "@assets/Icon/Followers.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import ProfileList, { type ProfileAction } from "@/components/Lists/ProfileList/ProfileList";
import ChangeMemberRole from "./modals/form/ChangeMemberRole/ChangeMemberRole";
import RemoveSquadMember from "./modals/core/RemoveSquadMember/RemoveSquadMember";


//TODO: Add Tags in SquadMembers when we have them (e.g. founder tag)

type SquadMembersProps = {
  squadId?: string;
};

const SquadMembers = ({ squadId }: SquadMembersProps) => {
  const { closePanel } = usePanel();
  const { openModal } = useModal();
  const { user } = useAuth();
  const currentSquad = useSelector(selectCurrentSquad);
  const squadViewType = useSelector(selectSquadViewType);
  const resolvedSquadId = squadId ?? currentSquad?.id ?? "";
  const { data: members = [] } = useSquadMembers(resolvedSquadId);

  const formatedProfiles = members.map((member) => ({
    id: member.profile_id,
    label: member.username,
    avatar: {
      avatarType: member.avatar_type,
      avatarValue: member.avatar_value,
    },
    secondaryInfo: convertGameTypeToFullName(member.game_type),
    tags: member.role === "founder" ? (["founder"] as Tag[]) : undefined,
  }));

  const membersCount = members.length;
  const membersPanelTitle = `${membersCount} Member${membersCount !== 1 ? "s" : ""}`;
  const emptyPanelTitle = "Members";

  const handleProfileAction = (
    selectedProfileId: string,
    action: ProfileAction,
  ) => {
    if (action === "view") {
      closePanel();
      navigate(`/profile/${selectedProfileId}`);
    } else if (action === "remove") {
      if (!user?.id) return;
      openModal(<RemoveSquadMember squadId={resolvedSquadId} profileId={selectedProfileId} />);
    } else if (action === "changeRole") {
      if (!user?.id) return;

      // Find the selected member's current role and other info to pass to the ChangeMemberRole modal.
      const selectedMember = members.find(
        (member) => member.profile_id === selectedProfileId,
      );

      // If we can't find the member (which shouldn't happen), we can't proceed with changing the role.
      if (!selectedMember) return;

      openModal(
        <ChangeMemberRole
          currentSquadId={resolvedSquadId}
          profileId={selectedProfileId}
          currentRole={selectedMember.role}
          memberUserInfo={{
            username: selectedMember.username,
            information: convertGameTypeToFullName(selectedMember.game_type),
            size: "medium",
            avatarType: selectedMember.avatar_type,
            avatarValue: selectedMember.avatar_value,
          }}
        />,
      );
    }
  };

  return (
    <PanelLayout
      panelTitle={membersCount > 0 ? membersPanelTitle : emptyPanelTitle}
      panelTitleIcon={<FollowersIcon />}
    >
      <>
        {members && members.length > 0 ? (
          <ProfileList
            key={resolvedSquadId}
            items={formatedProfiles}
            onClick={handleProfileAction}
            allowRemoveAction={squadViewType === "founder"}
            allowChangeRoleAction={squadViewType === "founder"}
            removeType="member"
            listType="squad"
          />
        ) : (
          <EmptyMessage
            title="No Members Yet"
            icon={<FollowersIcon />}
            subtitle="Members of this Squad will appear here."
          />
        )}
      </>
    </PanelLayout>
  );
};

export default SquadMembers;
