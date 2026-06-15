// import { useAppTheme } from "@/providers/theme/useTheme";
// import { LogoThemes } from "@/app/design/logoThemes";
import ArrowForwardIcon from "@/assets/Icon/Arrow_Forward.svg?react";
import SearchIcon from "@/assets/Icon/Search.svg?react";
import GrandTurismoImage from "@/assets/Homepage/Games/GT7.png";
import IRacingImage from "@/assets/Homepage/Games/iRacing.png";
import AssettoCorsaImage from "@/assets/Homepage/Games/Evo.png";
import LeMansImage from "@/assets/Homepage/Games/LeMans.png";
import ProfileIcon from "@assets/Icon/Profile.svg?react";
import SquadIcon from "@assets/Icon/Squad.svg?react";
import LeagueIcon from "@assets/Icon/League.svg?react";
import LeagueImage from "@assets/Cover/cover1.png";
import CardsImage from "@assets/Homepage/Features/Cards.png";
import DriverImage from "@assets/Homepage/Features/Driver.png";
import ExternalIcon from "@assets/Icon/External.svg?react";
import FollowIcon from "@assets/Icon/Follow.svg?react";
import {
  ButtonContainer,
  Container,
  GameImage,
  Games,
  GamesContainer,
  GraphicContainer,
  Hero,
  IconWrapper,
  PathContainer,
  PathContentTitle,
  PathContentSubTitle,
  PathItem,
  PathItemImageContainer,
  Paths,
  SubTitle,
  TextContainer,
  Title,
  Wrapper,
  PathContent,
  PathContentButtons,
  SectionList,
  VIPSection,
  VIPContainerWrapper,
  VIPContainer,
  VIPMiniTitle,
  VIPTitle,
  VIPSubTitle,
  VIPList,
  VIPItemTop,
  VIPItemBottom,
  VIPLeagueContainer,
  VIPLeagueContents,
  VIPLeagueContentsButtons,
  VIPLeagueContentsTitle,
  VIPLeagueContentsSubTitle,
  VIPLeagueContentsTextContainer,
  SectionTitle,
  SectionSubTitle,
  VIPItemBottomItem,
  VIPItemBottomImage,
  VIPItemBottomContents,
  ItemTextContainer,
  ItemSubTitle,
  ItemTitle,
  FeaturedLeaguesSection,
  FeaturedLeaguesContainer,
  FeaturedLeaguesList,
  BlueFeaturedLeagueItem,
  FeaturedLeagueItemContents,
  FeaturedLeagueContentsButtons,
  RedFeaturedLeagueItem,
  AboutContainer,
  AboutSection,
  AboutContents,
  AboutItem,
  AboutItemImage,
  AboutItemTextContainer,
  AboutItemBulletList,
  AboutItemTitleContainer,
  AboutItemTitle,
  AboutItemSubTitle,
  AboutItemBullet,
  LeagueSection,
  LeagueTabs,
  LeagueTabContent,
  LeagueContainer,
  LeagueTabImage,
  ContactSection,
  ContactContainer,
  ContactButtons,
} from "./Homepage.styles";
import Button from "@/components/Button/Button";
import { useAuth } from "@/providers/auth/useAuth";
import SearchForm from "@/features/search/forms/SearchForm";
import { useModal } from "@/providers/modal/useModal";
import { navigate } from "@/app/navigation/navigation";
import LeagueCard from "@/components/Cards/LeagueCard/LeagueCard";
import Tabs from "@/components/Tabs/Tabs/Tabs";
import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

const TabsData = [
  { id: "league", label: "League" },
  { id: "season", label: "Squad" },
  { id: "division", label: "Division" },
  { id: "round", label: "Round" },
  { id: "event", label: "Event" },
  { id: "session", label: "Session" },
];

const Homepage = () => {
  // Theme
  // const { themeName } = useAppTheme();
  // const LogoIcon = LogoThemes[themeName];
  const { user } = useAuth();
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState<string>("league");
  const { track } = useAnalytics();

  const tabContent = {
    league: {
      title: "League Info",
      subtitle:
        "Check the latest, featured leagues with our stamp of approval.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: LeagueImage,
    },
    season: {
      title: "Season Info",
      subtitle:
        "Check the latest, featured leagues with our stamp of approval.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: LeagueImage,
    },
    division: {
      title: "Division Info",
      subtitle:
        "Check the latest, featured leagues with our stamp of approval.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: LeagueImage,
    },
    round: {
      title: "Round Info",
      subtitle:
        "Check the latest, featured leagues with our stamp of approval.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: LeagueImage,
    },
    event: {
      title: "Event Info",
      subtitle:
        "Check the latest, featured leagues with our stamp of approval.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: LeagueImage,
    },
    session: {
      title: "Session Info",
      subtitle:
        "Check the latest, featured leagues with our stamp of approval.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: LeagueImage,
    },
  };

  const tab = tabContent[activeTab as keyof typeof tabContent];

  // -- Handlers -- //

  // Redirect to Create Account
  const handleGetStarted = () => {
    track("cta_click", "hero_get_started");
    return navigate("/create-account");
  };

  const handleSearch = (tab: "Leagues" | "Profiles" | "Squads") => {
    track("search_open", `search_${tab.toLowerCase()}`);
    openModal(<SearchForm startingTab={tab} />);
    return
  };

  const handleCreate = (type: string) => {
    track("create_click", `create_${type}`);
    navigate(`/create-${type.toLowerCase()}`);
    return
  };

  const handleLearnMore = (type: string) => {
    track("learn_more_click", `learn_more_${type}`);
    return
  };

  const handleViewSeasonGuide = () => {
    track("view_season_guide_click", "view_season_guide");
    return
  };

  const handleJoinDiscord = () => {
    track("join_league_discord_click", "join_league_discord");
    return
  };
  const handleGoToLeagueRating = () => {
    track("go_to_league_rating_click", "go_to_league_rating");
    return
  };

  const handleJoinLeague = (leagueName: string) => {
    track("join_league_click", `join_league_${leagueName.toLowerCase()}`);
    return
  };

  const handleFollowLeague = (leagueName: string) => {
    track("follow_league_click", `follow_league_${leagueName.toLowerCase()}`);
    return
  };

  const handleAboutClick = (type: string) => {
    track("about_click", `about_${type.toLowerCase()}`);
    return
  };

  const handleOnTabChange = (tabName: string) => {
    track("tab_change", `tab_change_${tabName.toLowerCase()}`);
    setActiveTab(tabName);
    return
  };

  const handleTabLinkClick = (tabName: string) => {
    track("tab_link_click", `tab_link_${tabName.toLowerCase()}`);
    return
  };

  return (
    <Wrapper>
      <Hero>
        <Container>
          <TextContainer>
            <Title>Your Main Sim Racing Hub</Title>
            <SubTitle>
              Create your driver profile, recruit your squad, and dominate
              custom leagues across iRacing, GT7, Assetto Corsa, and more.
            </SubTitle>
          </TextContainer>
          <ButtonContainer>
            {!user && (
              <Button
                color="base"
                icon={{ right: <ArrowForwardIcon /> }}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            )}
            <Button
              color="base"
              variant="outlined"
              icon={{ right: <SearchIcon /> }}
              onClick={() => handleSearch("Profiles")}
            >
              Search
            </Button>
          </ButtonContainer>
        </Container>
      </Hero>
      <Games>
        <GamesContainer>
          <GameImage src={GrandTurismoImage} alt="GT7" />
          <GameImage src={IRacingImage} alt="iRacing" />
          <GameImage src={AssettoCorsaImage} alt="Assetto Corsa" />
          <GameImage src={LeMansImage} alt="Le Mans" />
        </GamesContainer>
      </Games>
      <Paths>
        <PathContainer>
          <TextContainer>
            <SectionTitle>Your Journey Motorsport Leagues</SectionTitle>
            <SectionSubTitle>
              Explore the three things in this platform.
            </SectionSubTitle>
          </TextContainer>
          <SectionList>
            <PathItem>
              <PathItemImageContainer>
                <GraphicContainer>
                  <IconWrapper>
                    <ProfileIcon />
                  </IconWrapper>
                </GraphicContainer>
              </PathItemImageContainer>
              <PathContent>
                <TextContainer>
                  <PathContentTitle>Profiles</PathContentTitle>
                  <PathContentSubTitle>
                    Build your career profile, track stats, and find active
                    championships.
                  </PathContentSubTitle>
                </TextContainer>
                <PathContentButtons>
                  <Button
                    color="base"
                    icon={{ left: <ProfileIcon /> }}
                    fullWidth
                    onClick={
                      user
                        ? () => {
                            handleCreate("Profile");
                          }
                        : handleGetStarted
                    }
                  >
                    Create Profile
                  </Button>
                  <Button
                    color="base"
                    variant="outlined"
                    icon={{ left: <SearchIcon /> }}
                    fullWidth
                    onClick={() => handleSearch("Profiles")}
                  >
                    Find Profile
                  </Button>
                  <Button
                    color="base"
                    variant="ghost"
                    onClick={() => handleLearnMore("Profiles")}
                    fullWidth
                  >
                    Learn More
                  </Button>
                </PathContentButtons>
              </PathContent>
            </PathItem>
            <PathItem>
              <PathItemImageContainer>
                <GraphicContainer>
                  <IconWrapper>
                    <ProfileIcon />
                  </IconWrapper>
                </GraphicContainer>
              </PathItemImageContainer>
              <PathContent>
                <TextContainer>
                  <PathContentTitle>Squads</PathContentTitle>
                  <PathContentSubTitle>
                    Build your career profile, track stats, and find active
                    championships.
                  </PathContentSubTitle>
                </TextContainer>
                <PathContentButtons>
                  <Button
                    color="base"
                    icon={{ left: <SquadIcon /> }}
                    fullWidth
                    onClick={
                      user
                        ? () => {
                            handleCreate("Squad");
                          }
                        : handleGetStarted
                    }
                  >
                    Create Squad
                  </Button>
                  <Button
                    color="base"
                    variant="outlined"
                    icon={{ left: <SearchIcon /> }}
                    onClick={() => handleSearch("Squads")}
                    fullWidth
                  >
                    Find Squad
                  </Button>
                  <Button
                    color="base"
                    variant="ghost"
                    onClick={() => handleLearnMore("Squads")}
                    fullWidth
                  >
                    Learn More
                  </Button>
                </PathContentButtons>
              </PathContent>
            </PathItem>
            <PathItem>
              <PathItemImageContainer>
                <GraphicContainer>
                  <IconWrapper>
                    <ProfileIcon />
                  </IconWrapper>
                </GraphicContainer>
              </PathItemImageContainer>
              <PathContent>
                <TextContainer>
                  <PathContentTitle>Leagues</PathContentTitle>
                  <PathContentSubTitle>
                    Build your career profile, track stats, and find active
                    championships.
                  </PathContentSubTitle>
                </TextContainer>
                <PathContentButtons>
                  <Button
                    color="base"
                    icon={{ left: <LeagueIcon /> }}
                    fullWidth
                    onClick={
                      user
                        ? () => {
                            handleCreate("League");
                          }
                        : handleGetStarted
                    }
                  >
                    Create League
                  </Button>
                  <Button
                    color="base"
                    variant="outlined"
                    icon={{ left: <SearchIcon /> }}
                    fullWidth
                    onClick={() => handleSearch("Leagues")}
                  >
                    Find League
                  </Button>
                  <Button
                    color="base"
                    variant="ghost"
                    onClick={() => handleLearnMore("Leagues")}
                    fullWidth
                  >
                    Learn More
                  </Button>
                </PathContentButtons>
              </PathContent>
            </PathItem>
          </SectionList>
        </PathContainer>
      </Paths>
      <VIPSection>
        <VIPContainerWrapper>
          <VIPContainer>
            <TextContainer>
              <VIPMiniTitle>Motorsport Leagues presents</VIPMiniTitle>
              <VIPTitle>VIP GT World Championship</VIPTitle>
              <VIPSubTitle>The ultimate league.</VIPSubTitle>
            </TextContainer>
            <VIPList>
              <VIPItemTop>
                <VIPLeagueContainer>
                  <LeagueCard
                    name={"VIP GT World Championship"}
                    coverImageUrl={LeagueImage}
                    seasonStatus={"setup"}
                    size={"medium"}
                    gameType={"gt7"}
                    numOfParticipants={100}
                    hostingSquad="VIP Racing Team"
                  />
                  <VIPLeagueContents>
                    <VIPLeagueContentsTextContainer>
                      <VIPLeagueContentsTitle>
                        The Premium League
                      </VIPLeagueContentsTitle>
                      <VIPLeagueContentsSubTitle>
                        Join this league for the ultimate experience available
                        in Gran Turismo 7. It is held annually and is likely to
                        be the best thing ever made!
                      </VIPLeagueContentsSubTitle>
                    </VIPLeagueContentsTextContainer>
                    <VIPLeagueContentsButtons>
                      <Button color="primary" variant="ghost" onClick={handleViewSeasonGuide}>
                        View Season Guide
                      </Button>
                      <Button color="primary" variant="outlined" onClick={handleJoinDiscord}>
                        Join Discord
                      </Button>
                    </VIPLeagueContentsButtons>
                  </VIPLeagueContents>
                </VIPLeagueContainer>
              </VIPItemTop>
              <VIPItemBottom>
                <TextContainer>
                  <SectionTitle>Custom Features</SectionTitle>
                  <SectionSubTitle>
                    Explore the three things in this platform.
                  </SectionSubTitle>
                </TextContainer>
                <SectionList>
                  <VIPItemBottomItem>
                    <VIPItemBottomImage src={CardsImage} alt="Custom Cards" />
                    <VIPItemBottomContents>
                      <ItemTextContainer>
                        <ItemTitle>Check Driver’s League Ratings</ItemTitle>
                        <ItemSubTitle>
                          Check the latest, featured leagues with our stamp of
                          approval.
                        </ItemSubTitle>
                      </ItemTextContainer>
                      <Button color="base" icon={{ right: <ExternalIcon /> }} onClick={handleGoToLeagueRating}>
                        Go to MSLDrivers.com
                      </Button>
                    </VIPItemBottomContents>
                  </VIPItemBottomItem>
                  <VIPItemBottomItem $purple>
                    <VIPItemBottomImage src={DriverImage} alt="Driver" />
                    <VIPItemBottomContents>
                      <ItemTextContainer>
                        <ItemTitle>Check Driver’s League Ratings</ItemTitle>
                        <ItemSubTitle>
                          Check the latest, featured leagues with our stamp of
                          approval.
                        </ItemSubTitle>
                      </ItemTextContainer>
                      <Button color="base" icon={{ right: <ExternalIcon /> }} onClick={handleGoToLeagueRating}>
                        Go to MSLDrivers.com
                      </Button>
                    </VIPItemBottomContents>
                  </VIPItemBottomItem>
                </SectionList>
              </VIPItemBottom>
            </VIPList>
          </VIPContainer>
        </VIPContainerWrapper>
      </VIPSection>
      <FeaturedLeaguesSection>
        <FeaturedLeaguesContainer>
          <TextContainer>
            <SectionTitle>Featured Leagues</SectionTitle>
            <SectionSubTitle>
              Explore the three things in this platform.
            </SectionSubTitle>
          </TextContainer>
          <FeaturedLeaguesList>
            <BlueFeaturedLeagueItem>
              <LeagueCard
                name={"VIP GT World Championship"}
                coverImageUrl={LeagueImage}
                seasonStatus={"setup"}
                size={"medium"}
                gameType={"gt7"}
                numOfParticipants={100}
                hostingSquad="VIP Racing Team"
                themeColor={"blue"}
              />
              <FeaturedLeagueItemContents>
                <ItemTextContainer>
                  <ItemTitle>Monthly Fun Races</ItemTitle>
                  <ItemSubTitle>
                    Join this league for the ultimate experience available in
                    Gran Turismo 7. It is held annually and is likely to be the
                    best thing ever made!
                  </ItemSubTitle>
                </ItemTextContainer>
                <FeaturedLeagueContentsButtons>
                  <Button color="base">Join League</Button>
                  <Button
                    color="base"
                    variant="outlined"
                    icon={{ left: <FollowIcon /> }}
                  >
                    Follow
                  </Button>
                </FeaturedLeagueContentsButtons>
              </FeaturedLeagueItemContents>
            </BlueFeaturedLeagueItem>
            <RedFeaturedLeagueItem>
              <LeagueCard
                name={"VIP GT World Championship"}
                coverImageUrl={LeagueImage}
                seasonStatus={"setup"}
                size={"medium"}
                gameType={"gt7"}
                numOfParticipants={100}
                hostingSquad="VIP Racing Team"
                themeColor={"red"}
              />
              <FeaturedLeagueItemContents>
                <ItemTextContainer>
                  <ItemTitle>Monthly Fun Races</ItemTitle>
                  <ItemSubTitle>
                    Join this league for the ultimate experience available in
                    Gran Turismo 7. It is held annually and is likely to be the
                    best thing ever made!
                  </ItemSubTitle>
                </ItemTextContainer>
                <FeaturedLeagueContentsButtons>
                  <Button color="base">Join League</Button>
                  <Button
                    color="base"
                    variant="outlined"
                    icon={{ left: <FollowIcon /> }}
                  >
                    Follow
                  </Button>
                </FeaturedLeagueContentsButtons>
              </FeaturedLeagueItemContents>
            </RedFeaturedLeagueItem>
            <RedFeaturedLeagueItem>
              <LeagueCard
                name={"VIP GT World Championship"}
                coverImageUrl={LeagueImage}
                seasonStatus={"setup"}
                size={"medium"}
                gameType={"gt7"}
                numOfParticipants={100}
                hostingSquad="VIP Racing Team"
                themeColor={"red"}
              />
              <FeaturedLeagueItemContents>
                <ItemTextContainer>
                  <ItemTitle>Monthly Fun Races</ItemTitle>
                  <ItemSubTitle>
                    Join this league for the ultimate experience available in
                    Gran Turismo 7. It is held annually and is likely to be the
                    best thing ever made!
                  </ItemSubTitle>
                </ItemTextContainer>
                <FeaturedLeagueContentsButtons>
                  <Button color="base">Join League</Button>
                  <Button
                    color="base"
                    variant="outlined"
                    icon={{ left: <FollowIcon /> }}
                  >
                    Follow
                  </Button>
                </FeaturedLeagueContentsButtons>
              </FeaturedLeagueItemContents>
            </RedFeaturedLeagueItem>
          </FeaturedLeaguesList>
        </FeaturedLeaguesContainer>
      </FeaturedLeaguesSection>
      <AboutSection>
        <AboutContainer>
          <TextContainer>
            <SectionTitle>About Motorsport Leagues</SectionTitle>
            <SectionSubTitle>
              Explore the three things in this platform.
            </SectionSubTitle>
          </TextContainer>
          <AboutContents>
            <AboutItem $left>
              <AboutItemTextContainer>
                <AboutItemTitleContainer>
                  <AboutItemTitle>What is a Squad?</AboutItemTitle>
                  <AboutItemSubTitle>
                    Check the latest, featured leagues with our stamp of
                    approval.
                  </AboutItemSubTitle>
                </AboutItemTitleContainer>
                <AboutItemBulletList>
                  <AboutItemBullet>This is an explainer.</AboutItemBullet>
                  <AboutItemBullet>another one</AboutItemBullet>
                  <AboutItemBullet>and onter one.</AboutItemBullet>
                </AboutItemBulletList>
                <Button color="base" icon={{ right: <ExternalIcon /> }} onClick={() => handleAboutClick("squad")}>
                  Go to MSLDrivers.com
                </Button>
              </AboutItemTextContainer>
              <AboutItemImage />
            </AboutItem>
            <AboutItem>
              <AboutItemImage />
              <AboutItemTextContainer>
                <AboutItemTitleContainer>
                  <AboutItemTitle>What is a League?</AboutItemTitle>
                  <AboutItemSubTitle>
                    Check the latest, featured leagues with our stamp of
                    approval.
                  </AboutItemSubTitle>
                </AboutItemTitleContainer>
                <AboutItemBulletList>
                  <AboutItemBullet>This is an explainer.</AboutItemBullet>
                  <AboutItemBullet>another one</AboutItemBullet>
                  <AboutItemBullet>and onter one.</AboutItemBullet>
                </AboutItemBulletList>
                <Button color="base" icon={{ right: <ExternalIcon /> }} onClick={() => handleAboutClick("league")} >
                  Go to MSLDrivers.com
                </Button>
              </AboutItemTextContainer>
            </AboutItem>
            <AboutItem $left>
              <AboutItemTextContainer>
                <AboutItemTitleContainer>
                  <AboutItemTitle>What is a Profile?</AboutItemTitle>
                  <AboutItemSubTitle>
                    Check the latest, featured leagues with our stamp of
                    approval.
                  </AboutItemSubTitle>
                </AboutItemTitleContainer>
                <AboutItemBulletList>
                  <AboutItemBullet>This is an explainer.</AboutItemBullet>
                  <AboutItemBullet>another one</AboutItemBullet>
                  <AboutItemBullet>and onter one.</AboutItemBullet>
                </AboutItemBulletList>
                <Button color="base" icon={{ right: <ExternalIcon /> }} onClick={() => handleAboutClick("profile")}>
                  Go to MSLDrivers.com
                </Button>
              </AboutItemTextContainer>
              <AboutItemImage />
            </AboutItem>
          </AboutContents>
          <LeagueSection>
            <LeagueContainer>
              <TextContainer>
                <SectionTitle>What’s in a League?</SectionTitle>
                <SectionSubTitle>
                  Explore the three things in this platform.
                </SectionSubTitle>
              </TextContainer>
              <LeagueTabs>
                <Tabs
                  tabs={TabsData}
                  activeTab={activeTab}
                  onTabChange={handleOnTabChange}
                />
                <LeagueTabContent>
                  <LeagueTabContent>
                    <AboutItemTextContainer>
                      <AboutItemTitleContainer>
                        <AboutItemTitle>{tab.title}</AboutItemTitle>
                        <AboutItemSubTitle>{tab.subtitle}</AboutItemSubTitle>
                      </AboutItemTitleContainer>
                      <AboutItemBulletList>
                        {tab.bullets.map((bullet, index) => (
                          <AboutItemBullet key={index}>
                            {bullet}
                          </AboutItemBullet>
                        ))}
                      </AboutItemBulletList>
                      <Button color="base" icon={{ right: <ExternalIcon /> }} onClick={() => handleTabLinkClick(tab.title)} >
                        {tab.link || "Go to MSLDrivers.com"}
                      </Button>
                    </AboutItemTextContainer>
                    <LeagueTabImage />
                  </LeagueTabContent>
                </LeagueTabContent>
              </LeagueTabs>
            </LeagueContainer>
          </LeagueSection>
          <ContactSection>
            <ContactContainer>
              <TextContainer>
                <SectionTitle>Got Questions?</SectionTitle>
                <SectionSubTitle>Contact me!</SectionSubTitle>
              </TextContainer>
              <ContactButtons>
                <Button color="base" onClick={() => handleJoinLeague("MSLDrivers")}>Join League</Button>
                <Button
                  color="base"
                  variant="outlined"
                  icon={{ left: <FollowIcon /> }}
                  onClick={() => handleFollowLeague("MSLDrivers")}
                >
                  Follow
                </Button>
              </ContactButtons>
            </ContactContainer>
          </ContactSection>
        </AboutContainer>
      </AboutSection>
    </Wrapper>
  );
};

export default Homepage;

//  <Wrapper>
//     <Container>
//       <LogoIcon />
//       <SubTitle>Coming Soon</SubTitle>
//     </Container>
//   </Wrapper>
