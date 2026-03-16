import { useEffect } from "react";
import { getInviteTablesByToken } from "@/services/squad.service";
import type { SquadViewType } from "@/types/squad.types";
import { useModal } from "@/providers/modal/useModal";
import JoinSquad from "@/features/squads/modals/core/JoinSquad/JoinSquad";
import GuestJoinSquad from "@/features/squads/modals/errors/GuestJoinSquad/GuestJoinSquad";

type UseSquadInviteTokenFlowProps = {
  viewType: SquadViewType | "loading";
  userHasActiveProfile: boolean;
  squadStatus: "idle" | "loading" | "fulfilled" | "rejected";
  squadId?: string;
  token?: string;
};

export const useSquadInviteTokenFlow = ({
  viewType,
  userHasActiveProfile,
  squadStatus,
  squadId,
  token,
}: UseSquadInviteTokenFlowProps) => {
  const { openModal } = useModal();

useEffect(() => {
  const loadInviteData = async () => {
    // ABORT if we don't have a token or if state is still resolving
    if (!token || !viewType || viewType === "loading" || squadStatus !== "fulfilled") {
      return;
    }

    if (!squadId) return;

    const inviteTableResult = await getInviteTablesByToken(token);
    if (!inviteTableResult.success) return;

    if (viewType === "founder") return;

    //     if (
    //   inviteTableResult.data.status === "pending" &&
    //   !inviteTableResult.data.clicked_at
    // ) {
    //   await markSquadInviteClickedByToken(token);
    // }
    
    if (viewType === "user" && !userHasActiveProfile) {
      openModal(<JoinSquad squadId={squadId} hasProfile={false} token={token}  />);
      return;
    }
    
    if (viewType === "guest") {
      openModal(<GuestJoinSquad />);
      return;
    }

    openModal(<JoinSquad squadId={squadId} hasProfile={true} token={token} profileId={inviteTableResult.data.profile_id} />);
  };

  void loadInviteData();
}, [squadId, token, userHasActiveProfile, viewType, squadStatus, openModal])}
