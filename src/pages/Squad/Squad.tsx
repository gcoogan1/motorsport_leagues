import SquadHeader from '@/components/Headers/SquadHeader/SquadHeader'
import banner1 from "@assets/SquadBadge/Badge1.png";
import { Wrapper } from './Squad.styles'

const Squad = () => {
  return (
    <Wrapper>
      <SquadHeader 
        squadId="123"
        squadName="Squad Name"
        bannerImage={banner1}
        onEdit={() => console.log("Edit Squad")}
        onShare={() => console.log("Share Squad")}
        onInvite={() => console.log("Invite to Squad")}
      />
    </Wrapper>
  )
}

export default Squad