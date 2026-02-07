import { useAppTheme } from "@/providers/theme/useTheme";
import { LogoThemes } from "@/app/design/logoThemes";
import { Container, SubTitle, Wrapper } from "./Homepage.styles";

const Homepage = () => {
  // Theme
  const { themeName } = useAppTheme();
  const LogoIcon = LogoThemes[themeName];

  return (
    <Wrapper>
      <Container>
        <LogoIcon />
        <SubTitle>Coming Soon</SubTitle>
      </Container>
    </Wrapper>
  );
};

export default Homepage;
