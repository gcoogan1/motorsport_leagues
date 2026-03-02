import { useEffect } from "react";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { getSquadByIdThunk } from "@/store/squads/squad.thunk";
import { getBannerVariants } from "@/components/Banner/Banner.variants";
import SquadHeader from "@/components/Headers/SquadHeader/SquadHeader";
import { useSquadMembers } from "@/hooks/rtkQuery/queries/useSquadMembers";
import { Wrapper } from "./Squad.styles";

const Squad = () => {
  const { squadId } = useParams<{ squadId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const squad = useSelector((state: RootState) => state.squad.currentSquad);
  const { data: squadMembers = [] } = useSquadMembers(squadId);

  useEffect(() => {
    // If the squadId from the URL params doesn't match the currently loaded squad, fetch the new squad data
    if (squadId && squad?.id !== squadId) {
      dispatch(getSquadByIdThunk(squadId));
    }
  }, [squadId, squad?.id, dispatch]);

  if (!squad) return null;

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
        bannerImage={bannerImage}
        members={members}
        onEdit={() => console.log("Edit Squad")}
        onShare={() => console.log("Share Squad")}
        onInvite={() => console.log("Invite to Squad")}
      />
    </Wrapper>
  );
};

export default Squad;
