import { useState } from "react";
import CarouselControl from "@/components/CarouselControl/CarouselControl";
import { ActionsContainer, CarContainer } from "./RoundCar.styles";
import Button from "@/components/Button/Button";

type RoundCarProps = {
  imageUrls: string[];
};

const RoundCar = ({ imageUrls }: RoundCarProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (imageUrls.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <CarContainer imageUrl={imageUrls[activeIndex]}>
      <ActionsContainer>
        <Button size="small" color="base" rounded>{imageUrls.length} Assigned Cars</Button>
        <CarouselControl
          selectedIndex={activeIndex}
          scrollSnaps={imageUrls.map((_, i) => i)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSelect={setActiveIndex}
        />
      </ActionsContainer>
    </CarContainer>
  );
};

export default RoundCar;
