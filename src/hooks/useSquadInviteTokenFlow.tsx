import { useEffect } from "react";
import { getInviteTablesByToken } from "@/services/squad.service";
import type { SquadViewType } from "@/types/squad.types";
import { useModal } from "@/providers/modal/useModal";
import JoinSquad from "@/features/squads/modals/core/JoinSquad/JoinSquad";
import GuestJoinSquad from "@/features/squads/modals/errors/GuestJoinSquad/GuestJoinSquad";

type UseSquadInviteTokenFlowProps = {
  token?: string;
  viewType: SquadViewType | "loading";
  userHasActiveProfile: boolean;
  squadStatus: "idle" | "loading" | "fulfilled" | "rejected";
};

export const useSquadInviteTokenFlow = ({
  token,
  viewType,
  userHasActiveProfile,
  squadStatus,
}: UseSquadInviteTokenFlowProps) => {
  const { openModal } = useModal();

useEffect(() => {
  const loadInviteData = async () => {
    // ABORT if we don't have a token or if state is still resolving
    if (!token || !viewType || viewType === "loading" || squadStatus !== "fulfilled") {
      return;
    }

    const inviteTableResult = await getInviteTablesByToken(token);
    if (!inviteTableResult.success) return;

    if (viewType === "founder") return;

    
    if (viewType === "user" && !userHasActiveProfile) {
      openModal(<JoinSquad hasProfile={false} />);
      return;
    }
    
    if (viewType === "guest") {
      openModal(<GuestJoinSquad />);
      return;
    }

    openModal(<JoinSquad hasProfile={true} />);
  };

  void loadInviteData();
}, [token, userHasActiveProfile, viewType, squadStatus, openModal])}
