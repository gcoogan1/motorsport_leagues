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
};

const CarouselControl = ({
  selectedIndex,
  scrollSnaps,
  onPrevious,
  onNext,
  onSelect,
}: CarouselControlProps) => {
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
        {scrollSnaps.map((_, index) => (
          <Indicator
            key={index}
            $isActive={
              index === selectedIndex
            }
            onClick={() =>
              onSelect(index)
            }
            aria-label={`Go to slide ${index + 1}`}
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