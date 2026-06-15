import type { CarCategory, CarsTable } from "@/types/cars.types";

export const getCarsByCategory = (
  cars: CarsTable[],
  category?: CarCategory,
) =>
  cars
    .filter(
      (car) =>
        car.car_category === category &&
        car.car_name?.toLowerCase() !== "any",
    )
    .sort((a, b) => (a.car_name ?? "").localeCompare(b.car_name ?? ""))
    .map((car) => ({
      label: car.car_name ?? "",
      value: car.id,
    }));

export const getCarCategoryOptions = (cars: CarsTable[]) => {
  return [...new Set(cars.map((car) => car.car_category))]
    .filter(Boolean)
    .sort()
    .map((category) => ({
      label: formatCarCategory(category!),
      value: category!,
    }));
};

export const formatCarCategory = (category: string): string => {
  return category
    .split(".")
    .map(
      (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join(".");
};
