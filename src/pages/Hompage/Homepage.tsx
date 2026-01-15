import { useAppTheme } from "@/app/design/hooks/useTheme";
import { LogoThemes } from "@/app/design/logoThemes";
import { Container, SubTitle, Wrapper } from "./Homepage.styles";
import { useDispatch } from "react-redux";
import { useAuth } from "@/providers/auth/useAuth";
import type { AppDispatch } from "@/store";
import { useEffect } from "react";
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
