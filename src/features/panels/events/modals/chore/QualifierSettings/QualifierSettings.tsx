import { FormProvider, useForm, useWatch, type UseFormReturn, type useFormContext } from "react-hook-form";
import type { AdvancedSettingsFormData } from "../../../forms/AdvancedSettings/advancedSettings.schema";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useModal } from "@/providers/modal/useModal";
import { useState } from "react";
import { FUEL_CONSUMPTION_RT_QUAL_DEFAULT, FUEL_CONSUMPTION_RT_QUAL_FORMATTER, FUEL_CONSUMPTION_RT_QUAL_MAX, FUEL_CONSUMPTION_RT_QUAL_MIN, FUEL_CONSUMPTION_RT_QUAL_STEP, INITIAL_FUEL_QUAL_DEFAULT, INITIAL_FUEL_QUAL_FORMATTER, INITIAL_FUEL_QUAL_MAX, INITIAL_FUEL_QUAL_MIN, INITIAL_FUEL_QUAL_STEP, QUALIFYING_CONTINUE_TIME_DEFAULT, QUALIFYING_CONTINUE_TIME_FORMATTER, QUALIFYING_CONTINUE_TIME_MAX, QUALIFYING_CONTINUE_TIME_MIN, QUALIFYING_CONTINUE_TIME_STEP, SLIPSTREAM_STRENGTH_QUAL_OPTIONS, TIME_LIMIT_OPTIONS, TIRE_WEAR_RT_QUAL_DEFAULT, TIRE_WEAR_RT_QUAL_FORMATTER, TIRE_WEAR_RT_QUAL_MAX, TIRE_WEAR_RT_QUAL_MIN, TIRE_WEAR_RT_QUAL_STEP } from "@/lib/constants/qualifierSettings";
import FormRow from "@/components/Forms/FormRow/FormRow";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import IncrementInput from "@/components/Inputs/IncrementInput/IncrementInput";
import { withMinDelay } from "@/utils/withMinDelay";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type QualifierSettingsProps = {
  formMethods?: UseFormReturn<AdvancedSettingsFormData>;
  setValue?: ReturnType<
    typeof useFormContext<AdvancedSettingsFormData>
  >["setValue"];
};

const QualifierSettings = ({ formMethods, setValue: propSetValue }: QualifierSettingsProps) => {
  const { closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useMediaQuery("(max-width: 919px)");

  const fallbackFormMethods = useForm<AdvancedSettingsFormData>({
    defaultValues: {
      timeLimit: "10min",
      qualContinTime: QUALIFYING_CONTINUE_TIME_DEFAULT,
      tireWearRtQual: TIRE_WEAR_RT_QUAL_DEFAULT,
      fuelConsumptionRtQual: FUEL_CONSUMPTION_RT_QUAL_DEFAULT,
      initialFuelQual: INITIAL_FUEL_QUAL_DEFAULT,
      slipstreamStrengthQual: "real",
    },
  });

  const resolvedFormMethods = formMethods ?? fallbackFormMethods;
  const resolvedSetValue = resolvedFormMethods.setValue ?? propSetValue;

  const qualContinTime = useWatch({
    control: resolvedFormMethods.control,
    name: "qualContinTime",
    defaultValue: QUALIFYING_CONTINUE_TIME_DEFAULT,
  });

  const tireWearRtQual = useWatch({
    control: resolvedFormMethods.control,
    name: "tireWearRtQual",
    defaultValue: TIRE_WEAR_RT_QUAL_DEFAULT,
  });

  const fuelConsumptionRtQual = useWatch({
    control: resolvedFormMethods.control,
    name: "fuelConsumptionRtQual",
    defaultValue: FUEL_CONSUMPTION_RT_QUAL_DEFAULT,
  });

  const initialFuelQual = useWatch({
    control: resolvedFormMethods.control,
    name: "initialFuelQual",
    defaultValue: INITIAL_FUEL_QUAL_DEFAULT,
  });

  // -- Handlers -- //

  const handleQualContinTimeChange = (value: number) => {
    resolvedSetValue("qualContinTime", value, { shouldDirty: true });
  };

  const handleTireWearRtQualChange = (value: number) => {
    resolvedSetValue("tireWearRtQual", value, { shouldDirty: true });
  };

  const handleFuelConsumptionRtQualChange = (value: number) => {
    resolvedSetValue("fuelConsumptionRtQual", value, { shouldDirty: true });
  };

  const handleInitialFuelQualChange = (value: number) => {
    resolvedSetValue("initialFuelQual", value, { shouldDirty: true });
  };

    const handleOnClose = () => {
    closeModal();
  };

  const handleOnSave = async () => {
    setIsSaving(true);
    try {
      if (formMethods && propSetValue) {
        const currentValues = formMethods.getValues();
        propSetValue("timeLimit", currentValues.timeLimit, { shouldDirty: true });
        propSetValue("qualContinTime", currentValues.qualContinTime, { shouldDirty: true });
        propSetValue("tireWearRtQual", currentValues.tireWearRtQual, { shouldDirty: true });
        propSetValue("fuelConsumptionRtQual", currentValues.fuelConsumptionRtQual, { shouldDirty: true });
        propSetValue("initialFuelQual", currentValues.initialFuelQual, { shouldDirty: true });
        propSetValue("slipstreamStrengthQual", currentValues.slipstreamStrengthQual, { shouldDirty: true });
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
        question={"Qualifier Settings"}
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
        <FormRow>
          <SelectInput 
            name="timeLimit"
            label="Time Limit"
            options={TIME_LIMIT_OPTIONS}
          />
          <IncrementInput
            name="qualContinTime"
            label="Qualifying Continuation Time"
            min={QUALIFYING_CONTINUE_TIME_MIN}
            max={QUALIFYING_CONTINUE_TIME_MAX}
            step={QUALIFYING_CONTINUE_TIME_STEP}
            formatter={QUALIFYING_CONTINUE_TIME_FORMATTER}
            value={qualContinTime}
            onChange={handleQualContinTimeChange}
          />
        </FormRow>
        <FormRow>
          <IncrementInput
            name="tireWearRtQual"
            label="Tire Wear Rate (Qualifier)"
            min={TIRE_WEAR_RT_QUAL_MIN}
            max={TIRE_WEAR_RT_QUAL_MAX}
            step={TIRE_WEAR_RT_QUAL_STEP}
            formatter={TIRE_WEAR_RT_QUAL_FORMATTER}
            value={tireWearRtQual}
            onChange={handleTireWearRtQualChange}
          />
          <IncrementInput
            name="fuelConsumptionRtQual"
            label="Fuel Consumption Rate (Qualifier)"
            min={FUEL_CONSUMPTION_RT_QUAL_MIN}
            max={FUEL_CONSUMPTION_RT_QUAL_MAX}
            step={FUEL_CONSUMPTION_RT_QUAL_STEP}
            formatter={FUEL_CONSUMPTION_RT_QUAL_FORMATTER}
            style={isMobile ? { maxWidth: "100%" } : { maxWidth: "200px" }}
            value={fuelConsumptionRtQual}
            onChange={handleFuelConsumptionRtQualChange}
          />
        </FormRow>
        <FormRow>
          <IncrementInput
            name="initialFuelQual"
            label="Initial Fuel (Qualifier)"
            min={INITIAL_FUEL_QUAL_MIN}
            max={INITIAL_FUEL_QUAL_MAX}
            step={INITIAL_FUEL_QUAL_STEP}
            formatter={INITIAL_FUEL_QUAL_FORMATTER}
            value={initialFuelQual}
            onChange={handleInitialFuelQualChange}
          />
          <SelectInput
            name="slipstreamStrengthQual"
            label="Slipstream Strength (Qualifier)"
            options={SLIPSTREAM_STRENGTH_QUAL_OPTIONS}
          />
        </FormRow>
      </FormModal>

    </FormProvider>
  )
}

export default QualifierSettings