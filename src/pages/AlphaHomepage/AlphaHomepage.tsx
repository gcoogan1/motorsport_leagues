import AlphaLogo from "@/assets/Alpha/VIPGTWC_LOGO.png";
import ReactGA from "react-ga4";
import DiscordIcon from "@assets/Icon/Discord.svg?react";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import { Container, Content, DiscordButton, Logo, LogoImage, SubTitle, Wrapper } from "./AlphaHomepage.styles";
import Icon from "@/components/Icon/Icon";


const DISCORD_INVITE_URL = "https://discord.gg/yjTMKydM9f";

const AlphaHomepage = () => {
  const handleDiscordClick = () => {
    ReactGA.event("discord_invite_click", {
    page: "alpha_homepage",
    button_text: "Join VIP Leagues Discord",
  });

    window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <Wrapper>
      <Container>
        <Content>
          <Logo>
            <LogoImage src={AlphaLogo} alt="Motorsport Leagues Logo" />
            <SubTitle>8 July - 26 September 2026</SubTitle>
          </Logo>
          <DiscordButton
            onClick={handleDiscordClick}
          >
            <DiscordIcon width={32} height={20} />
            Join VIP Leagues Discord
            <Icon>
              <ArrowForward />
            </Icon>
          </DiscordButton>
        </Content>
      </Container>
    </Wrapper>
  );
};

export default AlphaHomepage;
