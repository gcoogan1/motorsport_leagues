import { useMemo, useState } from "react";
import CarouselControl from "@/components/CarouselControl/CarouselControl";
import { ActionsContainer, CarContainer } from "./RoundCar.styles";
import Button from "@/components/Button/Button";

type CarDisplay = {
  imageUrl: string;
  label: string;
};

type RoundCarProps = {
  cars?: CarDisplay[];
  fallbackImageUrls?: string[];
  revealCars?: boolean;
};

const RoundCar = ({ cars = [], fallbackImageUrls = [], revealCars = false }: RoundCarProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const resolvedCars = useMemo(
    () =>
      cars.length > 0
        ? cars
        : fallbackImageUrls.map((imageUrl) => ({
            imageUrl,
            label: "Assigned Car",
          })),
    [cars, fallbackImageUrls],
  );

  if (resolvedCars.length === 0) {
    return null;
  }

  const safeActiveIndex = Math.min(activeIndex, resolvedCars.length - 1);

  const handlePrevious = () => {
    setActiveIndex(safeActiveIndex === 0 ? resolvedCars.length - 1 : safeActiveIndex - 1);
  };

  const handleNext = () => {
    setActiveIndex(safeActiveIndex === resolvedCars.length - 1 ? 0 : safeActiveIndex + 1);
  };

  return (
    <CarContainer imageUrl={resolvedCars[safeActiveIndex]?.imageUrl}>
      <ActionsContainer>
        {revealCars && (
          <Button size="small" color="base" rounded>
          {resolvedCars.length} Assigned Cars
        </Button>
        )}
        <CarouselControl
          selectedIndex={safeActiveIndex}
          scrollSnaps={resolvedCars.map((_, i) => i)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSelect={setActiveIndex}
        />
      </ActionsContainer>
    </CarContainer>
  );
};

export default RoundCar;
