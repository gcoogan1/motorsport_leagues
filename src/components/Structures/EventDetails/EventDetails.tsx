import { useMemo, useState } from "react";
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
  ItemText,
  Session,
  SessionLabel,
  Sessions,
} from "./EventDeatils.styles";

type EventDetailsItem = {
  imageUrl: string;
  text: string;
};

type EventDetailsProps = {
  sessions?: string[];
  sectionTitle?: string;
  items?: EventDetailsItem[];
  fallbackImageUrls?: string[];
  fallbackText?: string;
};

const CARD_WIDTH = 240;
const GAP = 8;

const EventDetails = ({
  sessions = ["Practice"],
  sectionTitle = "Car Selection",
  items = [],
  fallbackImageUrls = [],
  fallbackText = "Assigned Car",
}: EventDetailsProps) => {

    // Automatically find and set the middle card on load
    const [activeIndex, setActiveIndex] = useState(() => {
    const count = items.length > 0 
      ? items.length 
      : fallbackImageUrls.length > 0 
        ? fallbackImageUrls.length 
        : 1; // 1 represents the single "Hidden" fallback item
        
    return Math.floor(count / 2);
  });;

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
      safeActiveIndex === 0
        ? resolvedItems.length - 1
        : safeActiveIndex - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex(
      safeActiveIndex === resolvedItems.length - 1
        ? 0
        : safeActiveIndex + 1,
    );
  };

  return (
    <DetailsContainer>
      <Sessions>
        {sessions.map((session) => (
          <Session key={session}>
            <SessionLabel>{session}</SessionLabel>
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
                <ItemText>{item.text}</ItemText>
              </ImageContainer>
            ))}
          </Items>

          <CarouselControl
            selectedIndex={safeActiveIndex}
            scrollSnaps={Array.from(resolvedItems.keys())}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSelect={setActiveIndex}
          />
        </CarouselContainer>
      </CarSelection>
    </DetailsContainer>
  );
};

export default EventDetails;