import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  type UseFormReturn,
} from "react-hook-form";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useModal } from "@/providers/modal/useModal";
import { type AdvancedSettingsFormData } from "../../../forms/AdvancedSettings/advancedSettings.schema";
import SegmentedInput from "@/components/Inputs/SegmentedInput/SegmentedInput";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import IncrementInput from "@/components/Inputs/IncrementInput/IncrementInput";
import {
  EQUAL_CONDITION_OPTIONS,
  PRESET_WEATHER_OPTIONS,
  TIME_OF_DAY_OPTIONS,
  VARIABLE_TIME_SPEED_RATE_DEFAULT,
  VARIABLE_TIME_SPEED_RATE_MAX,
  VARIABLE_TIME_SPEED_RATE_MIN,
  VARIABLE_TIME_SPEED_RATE_FORMATTER,
  WEATHER_SELECTION_OPTIONS,
  VARIABLE_TIME_SPEED_RATE_STEP,
} from "@/lib/constants/timeWeatherSettings";
import TextInput from "@/components/Inputs/TextInput/TextInput";
import { useState } from "react";
import { withMinDelay } from "@/utils/withMinDelay";
import FormRow from "@/components/Forms/FormRow/FormRow";

type TimeWeatherProps = {
  formMethods?: UseFormReturn<AdvancedSettingsFormData>;
  setValue?: ReturnType<
    typeof useFormContext<AdvancedSettingsFormData>
  >["setValue"];
};

const TimeWeather = ({
  formMethods,
  setValue: propSetValue,
}: TimeWeatherProps) => {
  const { closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);

  // -- Form Setup -- //

  // This component can be used in two ways:
  // 1. As a standalone form within a modal, in which case it manages its own form state and updates the parent form on close.
  // 2. As a child component within the AdvancedSettings form, in which case it uses the form context provided by the parent and updates values directly on change.
  const fallbackFormMethods = useForm<AdvancedSettingsFormData>({
    defaultValues: {
      weatherSelection: "presetWeatherSelection",
      presetWeather: "s01",
      timeOfDay: "earlyMorning",
      equalCondition: "true",
      variableTimeSpeedRate: VARIABLE_TIME_SPEED_RATE_DEFAULT,
    },
  });

  const resolvedFormMethods = formMethods ?? fallbackFormMethods;

  const resolvedSetValue = resolvedFormMethods.setValue ?? propSetValue;
  const weatherSelection = useWatch({
    control: resolvedFormMethods.control,
    name: "weatherSelection",
    defaultValue: "presetWeatherSelection",
  });
  const variableTimeSpeedRate = useWatch({
    control: resolvedFormMethods.control,
    name: "variableTimeSpeedRate",
    defaultValue: VARIABLE_TIME_SPEED_RATE_DEFAULT,
  });
  const equalCondition = useWatch({
    control: resolvedFormMethods.control,
    name: "equalCondition",
    defaultValue: "true",
  });

  // -- Handlers -- //

  const handleWeatherSelectionChange = (value: string | number) => {
    resolvedSetValue?.("weatherSelection", value as string, {
      shouldDirty: true,
    });
  };

  const handleVariableTimeSpeedRateChange = (value: number) => {
    resolvedSetValue?.("variableTimeSpeedRate", value, { shouldDirty: true });
  };

  const handleOnClose = () => {
    closeModal();
  };

  const handleOnSave = async () => {
    setIsSaving(true);
    try {
      if (!formMethods && propSetValue) {
        const currentValues = resolvedFormMethods.getValues();
        propSetValue("weatherSelection", currentValues.weatherSelection, {
          shouldDirty: true,
        });
        propSetValue("presetWeather", currentValues.presetWeather, {
          shouldDirty: true,
        });
        propSetValue("customWeather", currentValues.customWeather, {
          shouldDirty: true,
        });
        propSetValue("timeOfDay", currentValues.timeOfDay, {
          shouldDirty: true,
        });
        propSetValue("equalCondition", currentValues.equalCondition, {
          shouldDirty: true,
        });
        propSetValue(
          "variableTimeSpeedRate",
          currentValues.variableTimeSpeedRate,
          { shouldDirty: true },
        );
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
        question={"Time / Weather Settings"}
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
        <SegmentedInput
          name={"weatherSelection"}
          inputLabel="Weather Selection Method"
          options={WEATHER_SELECTION_OPTIONS}
          value={weatherSelection}
          onChange={handleWeatherSelectionChange}
        />
        {weatherSelection === "presetWeatherSelection" ? (
          <SelectInput
            name={"presetWeather"}
            label="Preset Weather"
            options={PRESET_WEATHER_OPTIONS}
          />
        ) : (
          <TextInput
            name={"customWeather"}
            label={"Custom Weather"}
            placeholder="S01, S02, C03, C04, R05, R06, Random, Random"
          />
        )}
        {weatherSelection === "presetWeatherSelection" ? (
          <>
            <FormRow>
              <SelectInput
                name={"timeOfDay"}
                label="Time of the Day"
                options={TIME_OF_DAY_OPTIONS}
              />
              <SelectInput
                name={"equalCondition"}
                label="Equal Conditions Mode"
                options={EQUAL_CONDITION_OPTIONS}
              />
            </FormRow>
            {equalCondition === "false" && (
              <IncrementInput
                name={"variableTimeSpeedRate"}
                label="Variable Time Speed Rate"
                min={VARIABLE_TIME_SPEED_RATE_MIN}
                max={VARIABLE_TIME_SPEED_RATE_MAX}
                step={VARIABLE_TIME_SPEED_RATE_STEP}
                formatter={VARIABLE_TIME_SPEED_RATE_FORMATTER}
                value={variableTimeSpeedRate}
                onChange={handleVariableTimeSpeedRateChange}
              />
            )}
          </>
        ) : (
          <>
            <FormRow>
              <SelectInput
                name={"timeOfDay"}
                label="Time of the Day"
                options={TIME_OF_DAY_OPTIONS}
              />
              <IncrementInput
                name={"variableTimeSpeedRate"}
                label="Variable Time Speed Rate"
                min={VARIABLE_TIME_SPEED_RATE_MIN}
                max={VARIABLE_TIME_SPEED_RATE_MAX}
                step={VARIABLE_TIME_SPEED_RATE_STEP}
                formatter={VARIABLE_TIME_SPEED_RATE_FORMATTER}
                value={variableTimeSpeedRate}
                onChange={handleVariableTimeSpeedRateChange}
              />
            </FormRow>
          </>
        )}
      </FormModal>
    </FormProvider>
  );
};

export default TimeWeather;
