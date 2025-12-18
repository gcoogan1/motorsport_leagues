import styled from "styled-components";
import { colorTokens} from "./design/tokens/color";
import { fontCSS, typographyTokens } from "./design/tokens/typography";
import { borderTokens } from "./design/tokens/borders";
import { opacityCSS, effectsTokens, boxShadowCSS } from "./design/tokens/effects";

const backgroundColor = colorTokens.colors.base.base1;

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
  /* ${opacityCSS(effectsTokens.effects.opacity.opacity50)}; */
  ${boxShadowCSS(effectsTokens.effects.boxShadow.glowGoldRight)}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  /* border-color: ${colorTokens.colors.base.base3}; */
  /* border-width: ${borderTokens.width.medium};
  border-style: solid; */
  background-color: #000000;
  border-radius: ${borderTokens.radius.large};

`;

const SubText = styled.p`
  ${fontCSS(typographyTokens.typography.body.smallRegular)};
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