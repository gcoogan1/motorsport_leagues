import { useMemo, useState, type ReactNode } from "react";
import CarouselControl from "@/components/CarouselControl/CarouselControl";
import HiddenCarImage from "@/assets/Cars/Hidden.png";
import {
  CarSelection,
  CarouselContainer,
  DetailsContainer,
  Header,
  HeaderTitle,
  ImageContainer,
  Items,
  // ItemText,
  Session,
  SessionDivider,
  SessionLabel,
  Sessions,
} from "./EventDetails.styles";

type EventDetailsItem = {
  imageUrl: string;
  text: string;
};

type EventDetailsSession = {
  label: string;
  icon?: ReactNode;
};

type EventDetailsProps = {
  sessions?: Array<string | EventDetailsSession>;
  sectionTitle?: string;
  items?: EventDetailsItem[];
  fallbackImageUrls?: string[];
  fallbackText?: string;
};

const CARD_WIDTH = 240;
const GAP = 8;

const EventDetails = ({
  sessions = [],
  sectionTitle = "Car Selection",
  items = [],
  fallbackImageUrls = [],
  fallbackText = "Assigned Car",
}: EventDetailsProps) => {
  // Automatically find and set the middle card on load
  const [activeIndex, setActiveIndex] = useState(() => {
    const count =
      items.length > 0
        ? items.length
        : fallbackImageUrls.length > 0
          ? fallbackImageUrls.length
          : 1; // 1 represents the single "Hidden" fallback item

    return Math.floor(count / 2);
  });

  const resolvedItems = useMemo<EventDetailsItem[]>(() => {
    if (items.length > 0) {
      return items;
    }

    if (fallbackImageUrls.length > 0) {
      return fallbackImageUrls.map((imageUrl) => ({
        imageUrl,
        text: fallbackText,
      }));
    }

    return [
      {
        imageUrl: HiddenCarImage,
        text: "Hidden",
      },
    ];
  }, [fallbackImageUrls, fallbackText, items]);

  const resolvedSessions = useMemo<EventDetailsSession[]>(
    () =>
      sessions.map((session) =>
        typeof session === "string" ? { label: session } : session,
      ),
    [sessions],
  );

  // useEffect(() => {
  //   if (activeIndex >= resolvedItems.length) {
  //     setActiveIndex(0);
  //   }
  // }, [activeIndex, resolvedItems.length]);

  const safeActiveIndex = Math.max(
    0,
    Math.min(activeIndex, resolvedItems.length - 1),
  );

  const handlePrevious = () => {
    setActiveIndex(
      safeActiveIndex === 0 ? resolvedItems.length - 1 : safeActiveIndex - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex(
      safeActiveIndex === resolvedItems.length - 1 ? 0 : safeActiveIndex + 1,
    );
  };

  const showCarousel = resolvedItems.length > 1;

  return (
    <DetailsContainer>
      <Sessions>
        {resolvedSessions.map((session, index) => (
          <Session key={`${session.label}-${index}`}>
            {session.icon}
            <SessionLabel>{session.label}</SessionLabel>
            {index < resolvedSessions.length - 1 && (
              <SessionDivider>/</SessionDivider>
            )}
          </Session>
        ))}
      </Sessions>

      <CarSelection>
        <Header>
          <HeaderTitle>{sectionTitle}</HeaderTitle>
        </Header>

        <CarouselContainer>
          <Items
            $activeIndex={safeActiveIndex}
            $cardWidth={CARD_WIDTH}
            $gap={GAP}
          >
            {resolvedItems.map((item, index) => (
              <ImageContainer
                key={`${item.imageUrl}-${index}`}
                imageUrl={item.imageUrl}
              >
                {/* <ItemText>{item.text}</ItemText> */}
              </ImageContainer>
            ))}
          </Items>

          {showCarousel && (
            <CarouselControl
              selectedIndex={safeActiveIndex}
              scrollSnaps={Array.from(resolvedItems.keys())}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSelect={setActiveIndex}
            />
          )}
        </CarouselContainer>
      </CarSelection>
    </DetailsContainer>
  );
};

export default EventDetails;