import { useAppTheme } from "@/providers/theme/useTheme";
import { LogoThemes } from "@/app/design/logoThemes";
import {
  Container,
  SubTitle,
  Wrapper,
} from "./Homepage.styles";


// import { useCarousel } from "@/hooks/useCarousel";
// import CarouselControl from "@/components/CarouselControl/CarouselControl";

const Homepage = () => {
  // Theme
  const { themeName } = useAppTheme();
  const LogoIcon = LogoThemes[themeName];

  // Embla carousel hook
  // const {
  //   emblaRef,
  //   selectedIndex,
  //   scrollSnaps,
  //   scrollPrev,
  //   scrollNext,
  //   scrollTo,
  // } = useCarousel({ loop: true });

  return (
    <Wrapper>
      <Container>
        <LogoIcon />
        <SubTitle>Coming Soon</SubTitle>

        {/* ----------------------------- */}
        {/* EMBLA CAROUSEL */}
        {/* ----------------------------- */}
        {/* <div ref={emblaRef} style={{ overflow: "hidden" }}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: "0 0 100%" }}>
              Slide 1
            </div>
            <div style={{ flex: "0 0 100%" }}>
              Slide 2
            </div>
            <div style={{ flex: "0 0 100%" }}>
              Slide 3
            </div>
          </div>
        </div> */}

        {/* ----------------------------- */}
        {/* CONTROLS */}
        {/* ----------------------------- */}
        {/* <CarouselControl
          selectedIndex={selectedIndex}
          scrollSnaps={scrollSnaps}
          onPrevious={scrollPrev}
          onNext={scrollNext}
          onSelect={scrollTo}
        /> */}

        {/* ----------------------------- */}
        {/* OLD TEST CODE (kept for later) */}
        {/* ----------------------------- */}
        {/*
        <LeagueTabs
          leagues={[
            { id: "overview", label: "Overview" },
            { id: "lineup", label: "Lineup" },
            { id: "schedule", label: "Schedule" },
            { id: "standings", label: "Standings" },
            { id: "rules", label: "Rules" },
          ]}
          activeLeague={activeLeagueTab}
          onLeagueChange={setActiveLeagueTab}
          seasons={[
            { value: "season-1", label: "Season 1" },
            { value: "season-3", label: "Season 3" },
          ]}
          activeSeason={activeSeason}
          onSeasonChange={setActiveSeason}
        />
        */}
      </Container>
    </Wrapper>
  );
};

export default Homepage;