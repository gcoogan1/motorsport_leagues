import { useAppTheme } from "@/providers/theme/useTheme";
import { LogoThemes } from "@/app/design/logoThemes";
// import EventDetails from "@/components/Structures/EventDetails/EventDetails";
// import AssignedCarImage from "@/assets/Cars/Assigned.png";
// import HiddenCarImage from "@/assets/Cars/Hidden.png";
// import Cover1 from "@/assets/Cover/cover1.png";
// import Cover2 from "@/assets/Cover/cover2.png";
// import Cover3 from "@/assets/Cover/cover3.png";
// import Cover4 from "@/assets/Cover/cover4.png";
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

  // const eventDetailItems = [
  //   {
  //     imageUrl: AssignedCarImage,
  //     text: "Assigned · Ferrari 458 Italia",
  //   },
    // {
    //   imageUrl: Cover1,
    //   text: "Assigned · Porsche 911 RSR",
    // },
    // {
    //   imageUrl: Cover2,
    //   text: "Assigned · Nissan GT-R NISMO",
    // },
    // {
    //   imageUrl: Cover3,
    //   text: "Assigned · McLaren 720S GT3",
    // },
    // {
    //   imageUrl: Cover4,
    //   text: "Assigned · Mercedes-AMG GT3",
    // },
    // {
    //   imageUrl: HiddenCarImage,
    //   text: "Assigned · Hidden",
    // },
  // ];

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

        {/* <EventDetails
          sessions={["Practice", "Qualifying", "Race"]}
          sectionTitle="Car Selection"
          items={eventDetailItems}
        /> */}

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