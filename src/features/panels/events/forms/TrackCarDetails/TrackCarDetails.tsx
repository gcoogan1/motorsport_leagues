import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePanel } from "@/providers/panel/usePanel";
import { useModal } from "@/providers/modal/useModal";
import { useToast } from "@/providers/toast/useToast";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";
import { useGetCarsQuery } from "@/rtkQuery/API/carsApi";
import {
  useCreateEventCarDetails,
  useCreateEventTrackDetails,
  useDeleteEventCarDetailsByEventId,
  useUpdateEventTrackDetails,
} from "@/rtkQuery/hooks/mutations/useEventMutaion";
import { useAllEventCarDetails, useEventTrackDetails } from "@/rtkQuery/hooks/queries/useEvents";
import { getCarCategoryOptions, getCarsByCategory } from "@/utils/cars";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import PanelForm from "@/components/Forms/PanelForm/PanelForm";
import SelectInput, {
  type SelectInputOption,
} from "@/components/Inputs/SelectInput/SelectInput";
import SegmentedInput from "@/components/Inputs/SegmentedInput/SegmentedInput";
import AddItem from "@/components/AddItem/AddItem";
import Button from "@/components/Button/Button";
import EditIcon from "@assets/Icon/Edit.svg?react";
import RemoveIcon from "@assets/Icon/Remove.svg?react";
import { GT7_TRACK_OPTIONS } from "@/lib/constants/tracks";
import {
  CategoryCell,
  CategoryColumn,
  ColumnText,
  ExtraCell,
  TableBody,
  TableRow,
  TableWrapper,
} from "./trackCarDetails.styles";
import { ExtraColumn } from "@/components/Tables/InputTable/InputTable.styles";
import {
  trackCarDetailsSchema,
  type TrackCarDetailsFormValues,
} from "./trackCarDetails.schema";
import type { CarCategory, CarsTable } from "@/types/cars.types";

const EMPTY_CARS: CarsTable[] = [];

const CarSelections = [
  { label: "Specified", value: "Specified" },
  { label: "Category", value: "Category" },
  { label: "Assigned", value: "Assigned" },
];

type TrackCarDetailsProps = {
  eventId: string;
};

const TrackCarDetails = ({ eventId }: TrackCarDetailsProps) => {
  const { closePanel } = usePanel();
  const { openModal } = useModal();
  const { showToast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  const [createTrackDetails] = useCreateEventTrackDetails();
  const [updateTrackDetails] = useUpdateEventTrackDetails();
  const [createCarDetails] = useCreateEventCarDetails();
  const [deleteEventCars] = useDeleteEventCarDetailsByEventId();

  const { data: carsData } = useGetCarsQuery();
  const cars = carsData ?? EMPTY_CARS;
  const { data: eventTrackDetails } = useEventTrackDetails(eventId);
  const { data: eventCarDetails } = useAllEventCarDetails(eventId);

  const carCategories = useMemo(() => getCarCategoryOptions(cars), [cars]);

  const firstCarForCategory = useCallback(
    (category: CarCategory): string => {
      return getCarsByCategory(cars, category)[0]?.value ?? "";
    },
    [cars],
  );

  const resolveCarIdFromPersisted = useCallback(
    (carName?: string, category?: CarCategory): string => {
      if (!carName) return "";

      const matchedCar = cars.find(
        (car) =>
          car.car_name === carName &&
          (category ? car.car_category === category : true),
      );

      return matchedCar?.id ?? "";
    },
    [cars],
  );

  const getAnyCarByCategory = useCallback(
    (category: CarCategory) => {
      return cars.find(
        (car) =>
          car.car_category === category &&
          car.car_name?.trim().toLowerCase() === "any",
      );
    },
    [cars],
  );

  const getAssignedStockCar = useCallback(() => {
    return cars.find(
      (car) =>
        car.car_category === "stock" &&
        car.car_name?.trim().toLowerCase() === "assigned",
    );
  }, [cars]);

  // -- Form Setup -- //

  const defaultValues = useMemo<TrackCarDetailsFormValues>(() => {
    const mappedCars =
      eventCarDetails?.map((car) => {
        const category = (car.car_category ?? "gr.1") as CarCategory;

        return {
          category,
          model:
            resolveCarIdFromPersisted(car.car_name, category) ||
            firstCarForCategory(category),
        };
      }) ?? [];

    return {
      trackName: eventTrackDetails?.track_name ?? "",
      carSelection: eventCarDetails?.[0]?.car_selection ?? "Specified",
      cars: mappedCars,
      carCategory: eventCarDetails?.[0]?.car_category
        ? (eventCarDetails[0].car_category as CarCategory)
        : undefined,
      revealTrack: eventTrackDetails?.reveal_track ?? true,
      revealCarDetails: eventCarDetails?.[0]?.reveal_car ?? true,
    };
  }, [
    eventTrackDetails,
    eventCarDetails,
    resolveCarIdFromPersisted,
    firstCarForCategory,
  ]);

  const formMethods = useForm<TrackCarDetailsFormValues>({
    resolver: zodResolver(trackCarDetailsSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty },
  } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cars",
  });

  const carSelection = watch("carSelection");
  const watchedCarsFieldArray = useWatch({ control, name: "cars" });
  const watchedCars = useMemo(
    () => watchedCarsFieldArray ?? [],
    [watchedCarsFieldArray],
  );
  const revealTrack = watch("revealTrack");
  const revealCarDetails = watch("revealCarDetails");

  useEffect(() => {
    if (isDirty) return;
    reset(defaultValues);
  }, [defaultValues, isDirty, reset]);

  const categoryOptions = useMemo(() => {
    switch (carSelection) {
      case "Specified":
        return carCategories.filter((category) => category.value !== "stock");
      case "Category":
        return carCategories;
      default:
        return [];
    }
  }, [carCategories, carSelection]);

  const getAvailableCategoryOptionsForRow = useCallback(
    (rowIndex: number): SelectInputOption[] => {
      const selectedByOtherRows = new Set(
        watchedCars
          .map((row, index) => (index === rowIndex ? "" : row?.model ?? ""))
          .filter(Boolean),
      );

      return categoryOptions.filter((categoryOption) => {
        const optionsForCategory = getCarsByCategory(
          cars,
          categoryOption.value as CarCategory,
        );

        return optionsForCategory.some(
          (carOption) => !selectedByOtherRows.has(carOption.value),
        );
      });
    },
    [watchedCars, categoryOptions, cars],
  );

  const getAvailableModelOptionsForRow = useCallback(
    (rowIndex: number, category?: CarCategory): SelectInputOption[] => {
      if (!category) return [];

      const selectedByOtherRows = new Set(
        watchedCars
          .map((row, index) => (index === rowIndex ? "" : row?.model ?? ""))
          .filter(Boolean),
      );

      const currentModelId = watchedCars[rowIndex]?.model;

      return getCarsByCategory(cars, category).filter(
        (carOption) =>
          carOption.value === currentModelId ||
          !selectedByOtherRows.has(carOption.value),
      );
    },
    [watchedCars, cars],
  );

  const appendableCategoryOptions = useMemo(() => {
    const selectedModels = new Set(
      watchedCars.map((row) => row?.model ?? "").filter(Boolean),
    );

    return categoryOptions.filter((categoryOption) => {
      const optionsForCategory = getCarsByCategory(
        cars,
        categoryOption.value as CarCategory,
      );

      return optionsForCategory.some(
        (carOption) => !selectedModels.has(carOption.value),
      );
    });
  }, [watchedCars, categoryOptions, cars]);

  // -- Handlers -- //

  const handleAppendCar = () => {
    const defaultCategory = appendableCategoryOptions.some(
      (category) => category.value === "gr.1",
    )
      ? ("gr.1" as CarCategory)
      : (appendableCategoryOptions[0]?.value as CarCategory | undefined);

    if (!defaultCategory) {
      return;
    }

    const defaultModel = getAvailableModelOptionsForRow(9999, defaultCategory)[0]?.value ?? "";

    if (!defaultModel) {
      return;
    }

    append({ category: defaultCategory, model: defaultModel });
  };

  const handleHideTrack = () => {
    setValue("revealTrack", !revealTrack, { shouldDirty: true });
  };

  const handleHideCarDetails = () => {
    setValue("revealCarDetails", !revealCarDetails, { shouldDirty: true });
  };

  const handleSave = handleSubmit(async (data: TrackCarDetailsFormValues) => {
    if (data.carSelection === "Specified") {
      const selectedRows = (data.cars ?? []).filter(
        (row) => Boolean(row.category) && Boolean(row.model),
      );

      const hasDuplicates =
        new Set(selectedRows.map((row) => row.model)).size !==
        selectedRows.length;

      if (hasDuplicates) {
        return;
      }
    }

    setIsSaving(true);

    try {
      await withMinDelay(
        (async () => {
          if (eventTrackDetails) {
            await updateTrackDetails({
              eventId,
              trackName: data.trackName,
              revealTrack: data.revealTrack,
            }).unwrap();
          } else {
            await createTrackDetails({
              eventId,
              trackName: data.trackName,
              revealTrack: data.revealTrack,
            }).unwrap();
          }

          if (data.carSelection === "Specified") {
            // Reconcile car rows by replacing all existing rows for this event.
            await deleteEventCars(eventId).unwrap();

            const selectedRows = (data.cars ?? []).filter(
              (row) => Boolean(row.category) && Boolean(row.model),
            );

            for (const row of selectedRows) {
              const selectedCar = cars.find((car) => car.id === row.model);
              if (!selectedCar) continue;

              await createCarDetails({
                eventId,
                carId: selectedCar.id,
                carSelection: "Specified",
                carCategory: row.category,
                carName: selectedCar.car_name,
                carImageUrl: selectedCar.car_image_url,
                revealCarDetails: data.revealCarDetails ?? true,
              }).unwrap();
            }
          }

          if (data.carSelection === "Category") {
            // Reconcile car rows by replacing all existing rows for this event.
            await deleteEventCars(eventId).unwrap();

            if (data.carCategory) {
              const anyCar = getAnyCarByCategory(data.carCategory);

              await createCarDetails({
                eventId,
                carId: anyCar?.id ?? "",
                carSelection: "Category",
                carCategory: data.carCategory,
                carName: "Any",
                carImageUrl: anyCar?.car_image_url ?? "",
                revealCarDetails: data.revealCarDetails ?? true,
              }).unwrap();
            }
          }

          if (data.carSelection === "Assigned") {
            // Reconcile car rows by replacing all existing rows for this event.
            await deleteEventCars(eventId).unwrap();

            const anyStockCar = getAssignedStockCar();

            await createCarDetails({
              eventId,
              carId: anyStockCar?.id ?? "",
              carSelection: "Assigned",
              carCategory: "stock",
              carName: "Any",
              carImageUrl: anyStockCar?.car_image_url ?? "",
              revealCarDetails: data.revealCarDetails ?? true,
            }).unwrap();
          }
        })(),
        1000,
      );

      showToast({
        usage: "success",
        message: "Track and car details updated.",
      });
      closePanel();
    } catch {
      handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <FormProvider {...formMethods}>
      <PanelLayout
        panelTitle="Track & Driver Details"
        panelTitleIcon={<EditIcon />}
        actions={{
          primary: {
            label: "Save",
            action: handleSave,
            loading: isSaving,
            loadingText: "Saving...",
            color: "primary",
          },
        }}
      >
        <PanelForm
          title="Track"
          checkboxOption={{
            label: "Don't Reveal",
            checked: !revealTrack,
            onChange: handleHideTrack,
          }}
        >
          <SelectInput
            name="trackName"
            options={GT7_TRACK_OPTIONS}
            placeholder="Track Name"
            hasError={!!errors.trackName}
            errorMessage={errors.trackName?.message}
            onValueChange={(value) =>
              setValue("trackName", value, { shouldDirty: true })
            }
          />
        </PanelForm>

        <PanelForm
          title="Car Details"
          hasMultiple
          checkboxOption={{
            label: "Don't Reveal",
            checked: !revealCarDetails,
            onChange: handleHideCarDetails,
          }}
        >
          <SegmentedInput
            name="carSelection"
            inputLabel="Car Selection"
            helperMessage="All drivers use the same car(s) for this round."
            options={CarSelections}
            value={carSelection}
            onChange={(value) =>
              setValue(
                "carSelection",
                value as "Specified" | "Category" | "Assigned",
                { shouldDirty: true },
              )
            }
          />

          {carSelection === "Specified" && (
            <>
              {fields.length > 0 && (
                <TableWrapper>
                  <TableRow>
                    <CategoryColumn>
                      <ColumnText>Category</ColumnText>
                    </CategoryColumn>
                    <CategoryColumn>
                      <ColumnText>Model</ColumnText>
                    </CategoryColumn>
                    <ExtraColumn />
                  </TableRow>

                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <CategoryCell>
                          {/** Only show categories that still have at least one unselected car for this row. */}
                          <SelectInput
                            name={`cars.${index}.category`}
                            options={getAvailableCategoryOptionsForRow(index)}
                            placeholder="Select category"
                            openMenuOnFocus={false}
                            hasError={!!errors.cars?.[index]?.category}
                            errorMessage={errors.cars?.[index]?.category?.message}
                            onValueChange={(value) => {
                              const nextCategory = value as CarCategory;

                              const nextModel =
                                getAvailableModelOptionsForRow(
                                  index,
                                  nextCategory,
                                )[0]?.value ?? "";

                              setValue(`cars.${index}.category`, nextCategory, {
                                shouldDirty: true,
                              });
                              setValue(
                                `cars.${index}.model`,
                                nextModel,
                                { shouldDirty: true },
                              );
                            }}
                          />
                        </CategoryCell>

                        <CategoryCell>
                          <SelectInput
                            name={`cars.${index}.model`}
                            options={getAvailableModelOptionsForRow(
                              index,
                              watchedCars[index]?.category,
                            )}
                            placeholder="Select car"
                            openMenuOnFocus={false}
                            hasError={!!errors.cars?.[index]?.model}
                            errorMessage={errors.cars?.[index]?.model?.message}
                            onValueChange={(value) =>
                              setValue(`cars.${index}.model`, value, {
                                shouldDirty: true,
                              })
                            }
                          />
                        </CategoryCell>

                        <ExtraCell>
                          <Button
                            size="small"
                            color="base"
                            rounded
                            variant="ghost"
                            ariaLabel="remove row"
                            icon={{ left: <RemoveIcon /> }}
                            onClick={() => remove(index)}
                          />
                        </ExtraCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </TableWrapper>
              )}
              {appendableCategoryOptions.length > 0 && (
                <AddItem label="Add Car" onClick={handleAppendCar} />
              )}
            </>
          )}

          {carSelection === "Category" && (
            <SelectInput
              name="carCategory"
              options={categoryOptions}
              openMenuOnFocus={false}
              onValueChange={(value) =>
                setValue("carCategory", value as CarCategory, {
                  shouldDirty: true,
                })
              }
              placeholder="Select category"
              hasError={!!errors.carCategory}
              errorMessage={errors.carCategory?.message}
            />
          )}

          {carSelection === "Assigned" && null}
        </PanelForm>
      </PanelLayout>
    </FormProvider>
  );
};

export default TrackCarDetails;
