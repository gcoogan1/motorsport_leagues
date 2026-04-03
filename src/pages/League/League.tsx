import Cover from "@/components/Structures/Cover/Cover"
import FollowIcon from "@assets/Icon/Follow.svg?react";
import ShareIcon from "@assets/Icon/Share.svg?react";
import CoverOne from "@assets/Cover/1.png";
import { Wrapper } from "./League.styles"

// TODO: Update the League page to pull real data and implement actions

const League = () => {

  return (
    <Wrapper>
      <Cover
        title="Name of League" 
        gameType="gt7"
        squadName="Squad Name"
        description="This is the Squad Name's League for Game."
        participantsCount={12}
        followersCount={34}
        backgroundImageUrl={CoverOne}
        status="setup"
        tags={["director", "driver", "champion"]}
        optionalActions={[
          {
            label: "Join League",
            onClick: () => console.log("Join League clicked"),
            color: "primary"
          },{
            label: "Follow League",
            onClick: () => console.log("Follow League clicked"),
            color: "base",
            leftIcon: <FollowIcon />
          },{
            onClick: () => console.log("Unfollow League clicked"),
            color: "base",
            leftIcon: <ShareIcon />
          }
        ]}
      />
    </Wrapper>
  )
}

export default League