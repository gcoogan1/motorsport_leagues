import { useParams } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getBannerVariants } from "@/components/Banner/Banner.variants";
import SquadHeader from "@/components/Headers/SquadHeader/SquadHeader";
import { Wrapper } from "./Squad.styles";

const Squad = () => {
  const { squadId } = useParams<{ squadId: string }>();
  const squad = useSelector((state: RootState) =>
    state.squad.data?.find((s) => s.id === squadId)
  );

  if (!squad) return null;

  const bannerImage =
    squad.banner_type === "preset"
      ? getBannerVariants()[squad.banner_value as keyof ReturnType<typeof getBannerVariants>]
      : squad.banner_value;

  return (
    <Wrapper>
      <SquadHeader
        squadId={squad.id}
        squadName={squad.squad_name}
        bannerImage={bannerImage}
        onEdit={() => console.log("Edit Squad")}
        onShare={() => console.log("Share Squad")}
        onInvite={() => console.log("Invite to Squad")}
      />
    </Wrapper>
  );
};

export default Squad;
