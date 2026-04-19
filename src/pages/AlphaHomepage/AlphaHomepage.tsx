import AlphaLogo from "@/assets/Alpha/VIPGTWC_LOGO.png";
import DiscordIcon from "@assets/Icon/Discord.svg?react";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import { Container, Content, DiscordButton, Logo, LogoImage, SubTitle, Wrapper } from "./AlphaHomepage.styles";
import Icon from "@/components/Icon/Icon";


const DISCORD_INVITE_URL = "https://discord.gg/yjTMKydM9f";

const AlphaHomepage = () => {

  return (
    <Wrapper>
      <Container>
        <Content>
          <Logo>
            <LogoImage src={AlphaLogo} alt="Motorsport Leagues Logo" />
            <SubTitle>8 July - 26 September 2026</SubTitle>
          </Logo>
          <DiscordButton
            onClick={() => window.open(DISCORD_INVITE_URL, "_blank", "noopener,noreferrer")}
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
