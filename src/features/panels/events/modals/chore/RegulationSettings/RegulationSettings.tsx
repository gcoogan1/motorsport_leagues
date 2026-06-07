import { FormProvider, useForm, useFormContext, useWatch, type UseFormReturn } from "react-hook-form";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useModal } from "@/providers/modal/useModal";
import { type AdvancedSettingsFormData } from "../../../forms/AdvancedSettings/advancedSettings.schema";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import IncrementInput from "@/components/Inputs/IncrementInput/IncrementInput";
import CheckboxMultiSelectInput from "@/components/Inputs/CheckboxMultiSelectInput/CheckboxMultiSelectInput";

import { useState } from "react";
import { withMinDelay } from "@/utils/withMinDelay";
import { ASPIRATION_OPTIONS, DRIVETRAIN_OPTIONS, ENGINE_SWAP_OPTIONS, FILTER_BY_CATEGORY_OPTIONS, KART_USAGE_OPTIONS, MAX_POWER_OUTPUT_DEFAULT, MAX_POWER_OUTPUT_FORMATTER, MAX_POWER_OUTPUT_MAX, MAX_POWER_OUTPUT_MIN, MIN_WEIGHT_DEFAULT, MIN_WEIGHT_FORMATTER, MIN_WEIGHT_MAX, MIN_WEIGHT_MIN, NITROUS_OPTIONS, PP_LIMIT_DEFAULT, PP_LIMIT_FORMATTER, PP_LIMIT_MAX, PP_LIMIT_MIN, TUNING_PARTS_OPTIONS, USABLE_TIRE_OPTIONS, USABLE_TIRE_WEAR_OPTIONS, YEAR_LOWER_LIMIT_DEFAULT, YEAR_LOWER_LIMIT_FORMATTER, YEAR_LOWER_LIMIT_MAX, YEAR_LOWER_LIMIT_MIN, YEAR_UPPER_LIMIT_DEFAULT, YEAR_UPPER_LIMIT_FORMATTER, YEAR_UPPER_LIMIT_MAX, YEAR_UPPER_LIMIT_MIN } from "@/lib/constants/regulationSettings";
import FormRow from "@/components/Forms/FormRow/FormRow";

type RegulationSettingsProps = {
  formMethods?: UseFormReturn<AdvancedSettingsFormData>;
  setValue?: ReturnType<typeof useFormContext<AdvancedSettingsFormData>>["setValue"];
};

const RegulationSettings = ({ formMethods, setValue: propSetValue }: RegulationSettingsProps) => {
  const { closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);

  // -- Form Setup -- //

  // This component can be used in two ways:
  // 1. As a standalone form within a modal, in which case it manages its own form state and updates the parent form on close.
  // 2. As a child component within the AdvancedSettings form, in which case it uses the form context provided by the parent and updates values directly on change.
  const fallbackFormMethods = useForm<AdvancedSettingsFormData>({
    defaultValues: {
      filterCategory: "gr3",
      ppLimit: PP_LIMIT_DEFAULT,
      maxPowerOutput: MAX_POWER_OUTPUT_DEFAULT,
      minWeight: MIN_WEIGHT_DEFAULT,
      usableTires: "noLimit",
      usableTiresTypes: ["hard", "medium", "soft"],
      reqTireType: ["hard", "medium", "soft"],
      nitrous: "prohibited",
      kartUsage: "false",
      engineSwap: "unrestricted",
      tuningParts: "unrestricted",
      yearLowerLimit: YEAR_LOWER_LIMIT_DEFAULT,
      yearUpperLimit: YEAR_UPPER_LIMIT_DEFAULT,
      drivetrain: "unrestricted",
      aspiration: "unrestricted",
    },
  });

  const resolvedFormMethods = formMethods ?? fallbackFormMethods;
  const resolvedSetValue = resolvedFormMethods.setValue ?? propSetValue;

  const ppLimit = useWatch({
    control: resolvedFormMethods.control,
    name: "ppLimit",
    defaultValue: PP_LIMIT_DEFAULT,
  });

  const maxPowerOutput = useWatch({
    control: resolvedFormMethods.control,
    name: "maxPowerOutput",
    defaultValue: MAX_POWER_OUTPUT_DEFAULT,
  });

  const minWeight = useWatch({
    control: resolvedFormMethods.control,
    name: "minWeight",
    defaultValue: MIN_WEIGHT_DEFAULT,
  });

  const yearLowerLimit = useWatch({
    control: resolvedFormMethods.control,
    name: "yearLowerLimit",
    defaultValue: YEAR_LOWER_LIMIT_DEFAULT,
  });

  const yearUpperLimit = useWatch({
    control: resolvedFormMethods.control,
    name: "yearUpperLimit",
    defaultValue: YEAR_UPPER_LIMIT_DEFAULT,
  });

  // -- Handlers -- //

  const handlePPLimitChange = (value: number) => {
    resolvedSetValue("ppLimit", value, { shouldDirty: true });
  };

  const handleMaxPowerOutputChange = (value: number) => {
    resolvedSetValue("maxPowerOutput", value, { shouldDirty: true });
  };

  const handleMinWeightChange = (value: number) => {
    resolvedSetValue("minWeight", value, { shouldDirty: true });
  };

  const handleYearLowerLimitChange = (value: number) => {
    resolvedSetValue("yearLowerLimit", value, { shouldDirty: true });
  };

  const handleYearUpperLimitChange = (value: number) => {
    resolvedSetValue("yearUpperLimit", value, { shouldDirty: true });
  };

  const handleOnClose = () => {
    closeModal();
  };

  const handleOnSave = async () => {
    setIsSaving(true);
    try {
      if (!formMethods && propSetValue) {
        const currentValues = resolvedFormMethods.getValues();
        propSetValue("filterCategory", currentValues.filterCategory, { shouldDirty: true });
        propSetValue("ppLimit", currentValues.ppLimit, { shouldDirty: true });
        propSetValue("maxPowerOutput", currentValues.maxPowerOutput, { shouldDirty: true });
        propSetValue("minWeight", currentValues.minWeight, { shouldDirty: true });
        propSetValue("usableTires", currentValues.usableTires, { shouldDirty: true });
        propSetValue("usableTiresTypes", currentValues.usableTiresTypes, { shouldDirty: true });
        propSetValue("reqTireType", currentValues.reqTireType, { shouldDirty: true });
        propSetValue("nitrous", currentValues.nitrous, { shouldDirty: true });
        propSetValue("kartUsage", currentValues.kartUsage, { shouldDirty: true });
        propSetValue("engineSwap", currentValues.engineSwap, { shouldDirty: true });
        propSetValue("tuningParts", currentValues.tuningParts, { shouldDirty: true });
        propSetValue("yearLowerLimit", currentValues.yearLowerLimit, { shouldDirty: true });
        propSetValue("yearUpperLimit", currentValues.yearUpperLimit, { shouldDirty: true });
        propSetValue("drivetrain", currentValues.drivetrain, { shouldDirty: true });
        propSetValue("aspiration", currentValues.aspiration, { shouldDirty: true });
      }

      await withMinDelay(Promise.resolve(), 600);
      closeModal();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...resolvedFormMethods}>
      <FormModal
        question={"Regulation Settings"}
        buttons={{
          onCancel: { label: "Close", action: handleOnClose },
          onContinue: {
            label: "Save",
            action: handleOnSave,
            loading: isSaving,
            loadingText: "Saving...",
          },
        }}
      >
      <SelectInput 
        name="filterCategory"
        label="Filter by Category"
        options={FILTER_BY_CATEGORY_OPTIONS}
      />
      <FormRow>
        <IncrementInput
          name="ppLimit"
          label="PP Limit"
          min={PP_LIMIT_MIN}
          max={PP_LIMIT_MAX}
          formatter={PP_LIMIT_FORMATTER}
          clampOnBlur={false}
          helperText="No Limit → 100 to 1000"
          value={ppLimit}
          onChange={handlePPLimitChange}
        />
        <IncrementInput
          name="maxPowerOutput"
          label="Max. Power Output"
          min={MAX_POWER_OUTPUT_MIN}
          max={MAX_POWER_OUTPUT_MAX}
          formatter={MAX_POWER_OUTPUT_FORMATTER}
          helperText="No Limit → 99 HP to 1479 HP"
          value={maxPowerOutput}
          clampOnBlur={false}
          onChange={handleMaxPowerOutputChange}
        />
      </FormRow>
      <FormRow>
        <IncrementInput
          name="minWeight"
          label="Min. Weight"
          min={MIN_WEIGHT_MIN}
          max={MIN_WEIGHT_MAX}
          clampOnBlur={false}
          formatter={MIN_WEIGHT_FORMATTER}
          helperText="No Limit → 1102 lbs - 4409 lbs."
          value={minWeight}
          onChange={handleMinWeightChange}
        />
        <SelectInput
          name="usableTires"
          label="Usable Tires"
          options={USABLE_TIRE_OPTIONS}
        />
      </FormRow>
      <FormRow>
        <CheckboxMultiSelectInput
          name="usableTiresTypes"
          label="Usable Tire & Types"
          options={USABLE_TIRE_WEAR_OPTIONS}
        />
        <CheckboxMultiSelectInput
          name="reqTireType"
          label="Required Tire Type"
          options={USABLE_TIRE_WEAR_OPTIONS}
        />
      </FormRow>
      <FormRow>
        <SelectInput
          name="nitrous"
          label="Nitrous"
          options={NITROUS_OPTIONS}
        />
        <SelectInput
          name="kartUsage"
          label="Kart Usage"
          options={KART_USAGE_OPTIONS}
        />
      </FormRow>
      <FormRow>
        <SelectInput
          name="engineSwap"
          label="Engine Swap"
          options={ENGINE_SWAP_OPTIONS}
        />
        <SelectInput
          name="tuningParts"
          label="Tuning Parts"
          options={TUNING_PARTS_OPTIONS}
        />
      </FormRow>
      <FormRow>
        <IncrementInput
          name="yearLowerLimit"
          label="Year Lower Limit"
          min={YEAR_LOWER_LIMIT_MIN}
          max={YEAR_LOWER_LIMIT_MAX}
          formatter={YEAR_LOWER_LIMIT_FORMATTER}
          helperText="No Limit → 1930 - 2035"
          value={yearLowerLimit}
          onChange={handleYearLowerLimitChange}
          clampOnBlur={false}
        />
        <IncrementInput
          name="yearUpperLimit"
          label="Year Upper Limit"
          min={YEAR_UPPER_LIMIT_MIN}
          max={YEAR_UPPER_LIMIT_MAX}
          helperText="No Limit → 1929 - 2034"
          formatter={YEAR_UPPER_LIMIT_FORMATTER}
          value={yearUpperLimit}
          onChange={handleYearUpperLimitChange}
          clampOnBlur={false}
        />
      </FormRow>
      <FormRow>
        <SelectInput
          name="drivetrain"
          label="Drivetrain"
          options={DRIVETRAIN_OPTIONS}
        />
        <SelectInput
          name="aspiration"
          label="Aspiration"
          options={ASPIRATION_OPTIONS}
        />
      </FormRow>
      </FormModal>
    </FormProvider>
  );
};

export default RegulationSettings;
