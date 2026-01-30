import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppTheme } from "@/providers/theme/useTheme";
import { LogoThemes } from "@/app/design/logoThemes";
import { Container, SubTitle, Wrapper } from "./Homepage.styles";
import { useAuth } from "@/providers/auth/useAuth";
import type { AppDispatch } from "@/store";
import { fetchAccountThunk } from "@/store/account/account.thunks";
import { fetchProfilesThunk } from "@/store/profile/profile.thunk";

const Homepage = () => {
  // Theme
  const { themeName } = useAppTheme();
  const LogoIcon = LogoThemes[themeName];
  
  // Auth & Account
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAccountThunk(user.id));
      dispatch(fetchProfilesThunk(user.id));
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
