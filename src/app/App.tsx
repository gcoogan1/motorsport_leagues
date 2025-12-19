import styled from "styled-components";
import { designTokens } from "./design/tokens/index";

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
  ${effects.boxShadow.coverBaseDown};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: ${layout.space.large};
  /* border-color: ${colors.base.base3}; */
  /* border-width: ${borders.width.medium};
  border-style: solid; */
  background-color: #000000;
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
      </Content>
    </Container>
  );
};

export default App;