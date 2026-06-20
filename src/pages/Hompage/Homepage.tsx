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
import LeagueImage from "@assets/Homepage/leagueCard.png";
import CardsImage from "@assets/Homepage/Features/Cards.png";
import DriverImage from "@assets/Homepage/Features/Driver.png";
import ExternalIcon from "@assets/Icon/External.svg?react";
import FollowIcon from "@assets/Icon/Follow.svg?react";
import ProfilesPath from "@/assets/Homepage/Paths/profilesPath.png";
import SquadsPath from "@/assets/Homepage/Paths/squadPath.png";
import LeaguesPath from "@/assets/Homepage/Paths/leaguePath.png";
import VipLeagueImage from "@/assets/Cover/cover1.png";
import JokerImage from "@/assets/Homepage/jokerCard.png";
import LeagueTab from "@assets/Homepage/Tabs/leagueTab.png";
import SeasonTab from "@assets/Homepage/Tabs/seasonTab.png";
import DivisionTab from "@assets/Homepage/Tabs/divisionTab.png";
import RoundTab from "@assets/Homepage/Tabs/roundTab.png";
import EventTab from "@assets/Homepage/Tabs/eventTab.png";
import SessionTab from "@assets/Homepage/Tabs/sessionTab.png";
import ManageImage from "@assets/Homepage/manageImage.png";
import {
  ButtonContainer,
  Container,
  GameImage,
  Games,
  GamesContainer,
  Hero,
  PathContainer,
  PathContentTitle,
  PathContentSubTitle,
  PathItem,
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
  AboutItemTitleContainer,
  AboutItemTitle,
  AboutItemSubTitle,
  TabSection,
  TabWrapper,
  TabContent,
  TabContainer,
  TabImage,
  ContactSection,
  ContactContainer,
  ContactButtons,
  PathItemImage,
  YellowFeaturedLeagueItem,
  TabTextContainer,
  ManageSection,
  ManageContainer,
  ManageListItem,
  ManageListContainer,
  ManageImageContent,
} from "./Homepage.styles";
import Button from "@/components/Button/Button";
import { useAuth } from "@/providers/auth/useAuth";
import SearchForm from "@/features/search/forms/SearchForm";
import { useModal } from "@/providers/modal/useModal";
import { navigate } from "@/app/navigation/navigation";
import LeagueCard from "@/components/Cards/LeagueCard/LeagueCard";
import Tabs from "@/components/Tabs/Tabs/Tabs";
import { useRef, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

const TabsData = [
  { id: "league", label: "League" },
  { id: "season", label: "Season" },
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
  const profileSectionRef = useRef<HTMLDivElement>(null);
  const squadSectionRef = useRef<HTMLDivElement>(null);
  const leagueSectionRef = useRef<HTMLDivElement>(null);
  const { track } = useAnalytics();

  const tabContent = {
    league: {
      title: "The Racing Series",
      subtitle:
        "Leagues are a series of championships run by a community with a set list of participants.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: LeagueTab,
    },
    season: {
      title: "A Series of Championships",
      subtitle:
        "Seasons are a specific championship cycle within the league that contain their own unique overview and rules.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: SeasonTab,
    },
    division: {
      title: "Multiple Championships",
      subtitle:
        "Divisions are standalone competitive tiers within a season used to separate drivers with their own schedule and standings.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: DivisionTab,
    },
    round: {
      title: "Calendar Slots",
      subtitle:
        "Rounds are specific stops in the schedule that act as a container for all the racing events in that instance.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: RoundTab,
    },
    event: {
      title: "Race Days",
      subtitle:
        "Events are a single day of competition for the round in which drivers compete within.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: EventTab,
    },
    session: {
      title: "Track Time",
      subtitle:
        "Sessions are the smallest unit of competition on a track that gets recorded, either for qualifying or race.",
      bullets: ["This is an explainer.", "another one", "and onter one."],
      link: "https://msldrivers.com",
      image: SessionTab,
    },
  };

  const tab = tabContent[activeTab as keyof typeof tabContent];

  const ManageList = [
    "Announcements",
    "· League Chat",
    "· Season Overview",
    "· Division Management",
    "· Team & Driver Assignments",
    "· Season Schedule",
    "· Driver Briefing",
    "· Grid Lineup",
    "· Event Details",
    "· Broadcast Links",
    "· Incident Reporting",
    "· Steward Decisions",
    "· Steward Decisions",
    "· Steward Decisions",
    "· Rules & Regulations",
  ];

  // -- Handlers -- //

  // Redirect to Create Account
  const handleGetStarted = () => {
    track("cta_click", "hero_get_started");
    return navigate("/create-account");
  };

  const handleSearch = (tab: "Leagues" | "Profiles" | "Squads") => {
    track("search_open", `search_${tab.toLowerCase()}`);
    openModal(<SearchForm startingTab={tab} />);
    return;
  };

  const handleCreate = (type: string) => {
    track("create_click", `create_${type}`);
    navigate(`/create-${type.toLowerCase()}`);
    return;
  };

  const handleScrollToSection = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLearnMore = (type: string) => {
    track("learn_more_click", `learn_more_${type}`);
    if (type === "Profiles") {
      handleScrollToSection(profileSectionRef);
    } else if (type === "Squads") {
      handleScrollToSection(squadSectionRef);
    } else if (type === "Leagues") {
      handleScrollToSection(leagueSectionRef);
    }
    return;
  };

  const handleViewSeasonGuide = () => {
    track("view_season_guide_click", "view_season_guide");
    const url = "https://drive.google.com/file/d/1iG0xOqE32Oqwqzsv1CKEPfsTvvo8FuT6/view";
    return window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleJoinDiscord = () => {
    track("join_league_discord_click", "join_league_discord");
    const url = "https://discord.com/invite/QqWMBUT6G";
    return window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleGoToDrivers = () => {
    track("go_to_drivers_click", "go_to_drivers_legacy");
    const url = "https://www.MotorsportLeaguesDrivers.com";
    return window.open(url, "_blank", "noopener,noreferrer");
    return;
  };

  const handleGoToFantasy = () => {
    track("go_to_fantasy_click", "go_to_fantasy");
    const url = "https://www.MotorsportLeaguesFantasy.com";
    return window.open(url, "_blank", "noopener,noreferrer");
    return;
  };

  // const handleJoinLeague = (leagueName: string) => {
  //   track("join_league_click", `join_league_${leagueName.toLowerCase()}`);
  //   return;
  // };

  // const handleFollowLeague = (leagueName: string) => {
  //   track("follow_league_click", `follow_league_${leagueName.toLowerCase()}`);
  //   return;
  // };

  const handleOnTabChange = (tabName: string) => {
    track("tab_change", `tab_change_${tabName.toLowerCase()}`);
    setActiveTab(tabName);
    return;
  };


  // const handleTabLinkClick = (tabName: string) => {
  //   track("tab_link_click", `tab_link_${tabName.toLowerCase()}`);
  //   return
  // };

  return (
    <Wrapper>
      <Hero>
        <Container>
          <TextContainer>
            <Title>The Home <br /> of Sim Racing Leagues</Title>
            <SubTitle>
              Create and compete in custom sim racing leagues.
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
              icon={{ left: <SearchIcon /> }}
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
            <SectionTitle>Your Motorsport Leagues Journey</SectionTitle>
            <SectionSubTitle>
              Build your sim racing career with profiles, squads, and leagues.
            </SectionSubTitle>
          </TextContainer>
          <SectionList>
            <PathItem>
              <PathItemImage src={ProfilesPath} alt="Profile" />
              {/* <PathItemImageContainer>
                <GraphicContainer>
                  <IconWrapper>
                    <ProfileIcon />
                  </IconWrapper>
                </GraphicContainer>
              </PathItemImageContainer> */}
              <PathContent>
                <TextContainer>
                  <PathContentTitle>Profiles</PathContentTitle>
                  <PathContentSubTitle>
                    First, you’ll need a profile for the game you want to create
                    or join the league with.
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
              <PathItemImage src={SquadsPath} alt="Squad" />
              {/* <PathItemImageContainer>
                <GraphicContainer>
                  <IconWrapper>
                    <ProfileIcon />
                  </IconWrapper>
                </GraphicContainer>
              </PathItemImageContainer> */}
              <PathContent>
                <TextContainer>
                  <PathContentTitle>Squads</PathContentTitle>
                  <PathContentSubTitle>
                    Create or join a squad to manage your team and host your
                    very own leagues.
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
              <PathItemImage src={LeaguesPath} alt="League" />
              {/* <PathItemImageContainer>
                <GraphicContainer>
                  <IconWrapper>
                    <ProfileIcon />
                  </IconWrapper>
                </GraphicContainer>
              </PathItemImageContainer> */}
              <PathContent>
                <TextContainer>
                  <PathContentTitle>Leagues</PathContentTitle>
                  <PathContentSubTitle>
                    Create or join a league that holds seasonal championships
                    for multiple competitors.
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
              <VIPSubTitle>
                The most elite team-based sim racing league on Gran Turismo 7.
              </VIPSubTitle>
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
                        The Ultimate League
                      </VIPLeagueContentsTitle>
                      <VIPLeagueContentsSubTitle>
                        The four driver team championship kicks off its
                        inaugural season from 8 July to 26 September. Each of
                        the two divisions will battle across 8 challenging
                        rounds, taking competitors around the world to crown a
                        Team and Driver champion.
                      </VIPLeagueContentsSubTitle>
                    </VIPLeagueContentsTextContainer>
                    <VIPLeagueContentsButtons>
                      <Button
                        color="primary"
                        variant="ghost"
                        onClick={handleViewSeasonGuide}
                      >
                        View Season Guide
                      </Button>
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={handleJoinDiscord}
                      >
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
                    The VIP GT World Championship offers two extra features that are unique to its series.
                  </SectionSubTitle>
                </TextContainer>
                <SectionList>
                  <VIPItemBottomItem>
                    <VIPItemBottomImage src={CardsImage} alt="Custom Cards" />
                    <VIPItemBottomContents>
                      <ItemTextContainer>
                        <ItemTitle>Build Your Legacy</ItemTitle>
                        <ItemSubTitle>
                          View driver’s league specific performance metrics, including their League Rating, within the Drivers’ Cards.
                        </ItemSubTitle>
                      </ItemTextContainer>
                      <Button
                        color="base"
                        icon={{ right: <ExternalIcon /> }}
                        onClick={handleGoToDrivers}
                      >
                        MotorsportLeaguesDrivers.com
                      </Button>
                    </VIPItemBottomContents>
                  </VIPItemBottomItem>
                  <VIPItemBottomItem $purple>
                    <VIPItemBottomImage src={DriverImage} alt="Driver" />
                    <VIPItemBottomContents>
                      <ItemTextContainer>
                        <ItemTitle>Build Your Team</ItemTitle>
                        <ItemSubTitle>
                          Play along with the championship as a fantasy manager and get the opportunity to shake things up in the actual league.
                        </ItemSubTitle>
                      </ItemTextContainer>
                      <Button
                        color="base"
                        icon={{ right: <ExternalIcon /> }}
                        onClick={handleGoToFantasy}
                      >
                        MotorsportLeaguesFantasy.com
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
              Check out some of our most prestigious series partnered with Motorsport Leagues.
            </SectionSubTitle>
          </TextContainer>
          <FeaturedLeaguesList>
            <BlueFeaturedLeagueItem>
              <LeagueCard
                name={"VIP GT World Championship"}
                coverImageUrl={VipLeagueImage}
                seasonStatus={"setup"}
                size={"medium"}
                gameType={"gt7"}
                numOfParticipants={100}
                hostingSquad="VIP Racing Team"
                themeColor={"blue"}
              />
              <FeaturedLeagueItemContents>
                <ItemTextContainer>
                  <ItemTitle $color="blue">Fun Monthly Races</ItemTitle>
                  <ItemSubTitle>
                    Come hang out with the Victory In Performance Racing Team on
                    a monthly lobby night with three wild races with unique
                    cars.
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
            <YellowFeaturedLeagueItem>
              <LeagueCard
                name={"VIP GT World Championship"}
                coverImageUrl={LeagueImage}
                seasonStatus={"setup"}
                size={"medium"}
                gameType={"gt7"}
                numOfParticipants={100}
                hostingSquad="VIP Racing Team"
                themeColor={"yellow"}
              />
              <FeaturedLeagueItemContents>
                <ItemTextContainer>
                  <ItemTitle $color="yellow">The Ultimate League</ItemTitle>
                  <ItemSubTitle>
                    A premium championship on Gran Turismo 7 that is held
                    annually to crown a Team and Driver champion through 8
                    challenging rounds.
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
            </YellowFeaturedLeagueItem>
            <RedFeaturedLeagueItem>
              <LeagueCard
                name={"VIP GT World Championship"}
                coverImageUrl={JokerImage}
                seasonStatus={"setup"}
                size={"medium"}
                gameType={"gt7"}
                numOfParticipants={100}
                hostingSquad="VIP Racing Team"
                themeColor={"red"}
              />
              <FeaturedLeagueItemContents>
                <ItemTextContainer>
                  <ItemTitle $color="red">Custom Joker Races</ItemTitle>
                  <ItemSubTitle>
                    Take a unique spin on this once a month tournament that
                    includes a race with a mandatory Joker Lap that drivers must
                    take.
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
              Learn more about the features that make up this platform.
            </SectionSubTitle>
          </TextContainer>
          <AboutContents>
            <AboutItem $left>
              <AboutItemTextContainer ref={profileSectionRef}>
                <AboutItemTitleContainer>
                  <AboutItemTitle>What is a Profile?</AboutItemTitle>
                  <AboutItemSubTitle>
                    Profiles are an avatar that a user creates for a certain
                    game. They use this to participate in the sim racing
                    ecosystem by following and joining Squads and Leagues.
                  </AboutItemSubTitle>
                </AboutItemTitleContainer>
                {/* <AboutItemBulletList>
                  <AboutItemBullet>This is an explainer.</AboutItemBullet>
                  <AboutItemBullet>another one</AboutItemBullet>
                  <AboutItemBullet>and onter one.</AboutItemBullet>
                </AboutItemBulletList> */}
                <Button
                  color="base"
                  icon={{ left: <ProfileIcon /> }}
                  onClick={() => handleCreate("profile")}
                >
                  Create Profile
                </Button>
              </AboutItemTextContainer>
              <AboutItemImage src={ProfilesPath} />
            </AboutItem>
            <AboutItem>
              <AboutItemImage src={SquadsPath} />
              <AboutItemTextContainer ref={squadSectionRef}>
                <AboutItemTitleContainer>
                  <AboutItemTitle>What is a Squad?</AboutItemTitle>
                  <AboutItemSubTitle>
                    Squads are a team or a community of Profiles that usually
                    participate together. Squads are required to host a League,
                    and are not limited to a single game.
                  </AboutItemSubTitle>
                </AboutItemTitleContainer>
                {/* <AboutItemBulletList>
                  <AboutItemBullet>This is an explainer.</AboutItemBullet>
                  <AboutItemBullet>another one</AboutItemBullet>
                  <AboutItemBullet>and onter one.</AboutItemBullet>
                </AboutItemBulletList> */}
                <Button
                  color="base"
                  icon={{ left: <SquadIcon /> }}
                  onClick={() => handleCreate("squad")}
                >
                  Create Squad
                </Button>
              </AboutItemTextContainer>
            </AboutItem>
            <AboutItem $left>
              <AboutItemTextContainer ref={leagueSectionRef}>
                <AboutItemTitleContainer>
                  <AboutItemTitle>What is a League?</AboutItemTitle>
                  <AboutItemSubTitle>
                    Leagues are a series of championships, hosted by a Squad,
                    for a particular game. Profiles that want to join the League
                    must match the game that it is competed on.
                  </AboutItemSubTitle>
                </AboutItemTitleContainer>
                {/* <AboutItemBulletList>
                  <AboutItemBullet>This is an explainer.</AboutItemBullet>
                  <AboutItemBullet>another one</AboutItemBullet>
                  <AboutItemBullet>and onter one.</AboutItemBullet>
                </AboutItemBulletList> */}
                <Button
                  color="base"
                  icon={{ left: <LeagueIcon /> }}
                  onClick={() => handleCreate("league")}
                >
                  Create League
                </Button>
              </AboutItemTextContainer>
              <AboutItemImage src={LeaguesPath} />
            </AboutItem>
          </AboutContents>
        </AboutContainer>
      </AboutSection>
      <TabSection>
        <TabContainer>
          <TextContainer>
            <SectionTitle>Anatomy of a League</SectionTitle>
            <SectionSubTitle>
              Take a deep dive into how a League is structured.
            </SectionSubTitle>
          </TextContainer>
          <TabWrapper>
            <Tabs
              tabs={TabsData}
              activeTab={activeTab}
              onTabChange={handleOnTabChange}
            />
            <TabContent>
              <TabTextContainer>
                <AboutItemTitleContainer>
                  <AboutItemTitle>{tab.title}</AboutItemTitle>
                  <AboutItemSubTitle>{tab.subtitle}</AboutItemSubTitle>
                </AboutItemTitleContainer>
                {/* <AboutItemBulletList>
                      {tab.bullets.map((bullet, index) => (
                        <AboutItemBullet key={index}>
                          {bullet}
                        </AboutItemBullet>
                      ))}
                    </AboutItemBulletList> */}
                {/* <Button color="base" icon={{ right: <ExternalIcon /> }} onClick={() => handleTabLinkClick(tab.title)} >
                      {tab.link || "Go to MSLDrivers.com"}
                    </Button> */}
              </TabTextContainer>
              <TabImage src={tab.image} />
            </TabContent>
          </TabWrapper>
        </TabContainer>
      </TabSection>
      <ManageSection>
        <ManageContainer>
          <TextContainer>
            <SectionTitle>Manage Your Perfect League</SectionTitle>
            <SectionSubTitle>
              Manage your entire league, designed specifically for the game,
              through an intuitive interface that provides rich customization
              features for your sim racing series.
            </SectionSubTitle>
          </TextContainer>
          <ManageListContainer>
            {ManageList.map((item, index) => (
              <ManageListItem key={index}>{item}</ManageListItem>
            ))}
          </ManageListContainer>
          <ManageImageContent imageUrl={ManageImage} />
        </ManageContainer>
      </ManageSection>
      <ContactSection>
        <ContactContainer>
          <TextContainer>
            <SectionTitle>Ready to Race?</SectionTitle>
            <SectionSubTitle>Create your Profile, join a Squad, and design your perfect League.</SectionSubTitle>
          </TextContainer>
          <ContactButtons>
            <Button
              color="base"
              variant="outlined"
              icon={{ left: <SearchIcon /> }}
              onClick={() => handleSearch("Profiles")}
            >
              Search
            </Button>
                {!user && (
              <Button
                color="base"
                icon={{ right: <ArrowForwardIcon /> }}
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            )}
          </ContactButtons>
        </ContactContainer>
      </ContactSection>
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
