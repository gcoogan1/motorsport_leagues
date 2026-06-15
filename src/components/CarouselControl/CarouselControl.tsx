import ArrowBackward from "@assets/Icon/Arrow_Backward.svg?react";
import ArrowForward from "@assets/Icon/Arrow_Forward.svg?react";
import Button from "../Button/Button";
import {
  ControlWrapper,
  Indicator,
  Indicators,
} from "./CarouselControl.styles";
// To be used with the embla carousel hook to control the carousel and display indicators for each slide.

type CarouselControlProps = {
  selectedIndex: number;
  scrollSnaps: number[];

  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;

  maxDots?: number;
};

const CarouselControl = ({
  selectedIndex,
  scrollSnaps,
  onPrevious,
  onNext,
  onSelect,
  maxDots = 6,
}: CarouselControlProps) => {
  const totalSlides = scrollSnaps.length;

  const dotCount = Math.min(totalSlides, maxDots);

  const slidesPerDot =
    totalSlides > maxDots
      ? Math.ceil(totalSlides / maxDots)
      : 1;

  const activeDot = Math.floor(
    selectedIndex / slidesPerDot,
  );

  return (
    <ControlWrapper>
      <Button
        size="small"
        color="system"
        rounded
        variant="ghost"
        onClick={onPrevious}
        icon={{
          left: <ArrowBackward />,
        }}
      />

      <Indicators>
        {Array.from({ length: dotCount }).map((_, index) => (
          <Indicator
            key={index}
            $isActive={index === activeDot}
            onClick={() =>
              onSelect(index * slidesPerDot)
            }
            aria-label={`Go to slide ${
              index * slidesPerDot + 1
            }`}
          />
        ))}
      </Indicators>

      <Button
        size="small"
        color="system"
        rounded
        variant="ghost"
        onClick={onNext}
        icon={{
          right: <ArrowForward />,
        }}
      />
    </ControlWrapper>
  );
};

export default CarouselControl;