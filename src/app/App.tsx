import styled from "styled-components";
import { designTokens } from "./design/tokens/index";

import Chat from "@assets/Icon/Chat.svg?react";
import Avatar from "@assets/Avatar/Avatar.png";
import Badge3 from "@assets/SquadBadge/Badge3.png";
import MLLogo from "@assets/Logos/MS/MS_Vertical.svg?react";
import Ace from "@assets/Logos/Games/ACEvo.png"

const { colors, typography, borders, effects, layout } = designTokens;
const backgroundColor = colors.base.base1;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  /* background: ${backgroundColor}; */
`;

const Content = styled.div`
  /* ${effects.opacity.opacity50}; */
  ${effects.boxShadow.coverBaseDown}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: ${colors.text.text1};
  padding: ${layout.space.large};
  /* border-color: ${colors.base.base3}; */
  /* border-width: ${borders.width.medium};
  border-style: solid; */
  background-color: #000000;
  /* background: url(${Badge3}) no-repeat center center; */
  border-radius: ${borders.radius.large};

`;

const SubText = styled.p`
  ${typography.subtitle.smallItalic};
  background: transparent;
`;

const App = () => {

  return (
    <Container>
      <Content>
        <h1 style={{ background: "transparent"}}>Welcome to the Motorsport Leagues App!</h1>
        <SubText>Background Color: {backgroundColor}</SubText>
        <Chat width={48} height={48} color={colors.role.director} />
        <MLLogo color={colors.position.gold} />
        <img src={Avatar} alt="Avatar" width={150} />
        <img src={Ace} alt="iRacing Logo" width={150} />
      </Content>
    </Container>
  );
};

export default App;