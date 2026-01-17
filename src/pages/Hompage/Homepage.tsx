import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppTheme } from "@/providers/theme/useTheme";
import { LogoThemes } from "@/app/design/logoThemes";
import { Container, SubTitle, Wrapper } from "./Homepage.styles";
import { useAuth } from "@/providers/auth/useAuth";
import type { AppDispatch } from "@/store";
import { fetchProfileThunk } from "@/store/profile/profile.thunks";

const Homepage = () => {
  // Theme
  const { themeName } = useAppTheme();
  const LogoIcon = LogoThemes[themeName];
  
  // Auth & Profile
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfileThunk(user.id));
    }
  }, [user?.id, dispatch]);

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
