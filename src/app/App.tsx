import styled from "styled-components";
import { colorTokens } from "./design/tokens/color";
import { fontCSS, typographyTokens } from "./design/tokens/typography";

const backgroundColor = colorTokens.colors.base.base1;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
  width: 100vw;
  background: ${backgroundColor};
`;

const SubText = styled.p`
  ${fontCSS(typographyTokens.typography.body.smallRegular)};
  background: transparent;
`;

const App = () => {

  return (
    <Container>
      <h1 style={{ background: "transparent"}}>Welcome to the Motorsport Leagues App!</h1>
      <SubText>Background Color: {backgroundColor}</SubText>
    </Container>
  );
};

export default App;