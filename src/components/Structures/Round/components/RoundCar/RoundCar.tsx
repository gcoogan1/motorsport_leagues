import { useMemo, useState } from "react";
import CarouselControl from "@/components/CarouselControl/CarouselControl";
import { ActionsContainer, CarContainer } from "./RoundCar.styles";
import Button from "@/components/Button/Button";
import { capitalizeString } from "@/utils/capitalizeString";

type CarDisplay = {
  imageUrl: string;
  label: string;
  category?: string;
  carSelection?: string;
};

type RoundCarProps = {
  cars?: CarDisplay[];
  fallbackImageUrls?: string[];
  revealCars?: boolean;
};

const RoundCar = ({
  cars = [],
  fallbackImageUrls = [],
  revealCars = false,
}: RoundCarProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const resolvedCars = useMemo(
    () =>
      cars.length > 0
        ? cars
        : fallbackImageUrls.map((imageUrl) => ({
            imageUrl,
            label: "Assigned Car",
            category: "stock",
            carSelection: "default",
          })),
    [cars, fallbackImageUrls],
  );

  if (resolvedCars.length === 0) {
    return null;
  }

  const safeActiveIndex = Math.min(activeIndex, resolvedCars.length - 1);

  const handlePrevious = () => {
    setActiveIndex(
      safeActiveIndex === 0 ? resolvedCars.length - 1 : safeActiveIndex - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex(
      safeActiveIndex === resolvedCars.length - 1 ? 0 : safeActiveIndex + 1,
    );
  };

  const showCarousel = revealCars && resolvedCars.length > 1;

  const carButtonText = (resolvedCars: CarDisplay[]) => {
    if (!revealCars) {
      return "Hidden Car";
    }

    if (resolvedCars.length >= 1 && resolvedCars.every(car => car.carSelection === "Specified")) {
      const carText = resolvedCars.length === 1 ? "Specified Car" : "Specified Cars";
      return `${resolvedCars.length} ${carText}`;
    }

    if(resolvedCars.length === 1 && resolvedCars[0].carSelection === "Category" && resolvedCars[0].category) {
      return `Any Car from ${capitalizeString(resolvedCars[0].category)}`;
    }

    if(resolvedCars.length === 1 && resolvedCars[0].carSelection === "Assigned") {
      return `Assigned Car`;
    }

    return "Hidden Car";
  }

  const buttonText = carButtonText(resolvedCars);


  return (
    <CarContainer imageUrl={resolvedCars[safeActiveIndex]?.imageUrl}>
      <ActionsContainer>
          <Button size="small" color="base" rounded>
            {buttonText}
          </Button>
        {showCarousel && (
          <CarouselControl
            selectedIndex={safeActiveIndex}
            scrollSnaps={resolvedCars.map((_, i) => i)}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSelect={setActiveIndex}
          />
        )}
      </ActionsContainer>
    </CarContainer>
  );
};

export default RoundCar;
