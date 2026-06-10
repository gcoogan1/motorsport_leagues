import {
  FormProvider,
  useForm,
  useWatch,
  type UseFormReturn,
  type useFormContext,
} from "react-hook-form";
import type { AdvancedSettingsFormData } from "../../../forms/AdvancedSettings/advancedSettings.schema";
import FormModal from "@/components/Forms/FormModal/FormModal";
import { useModal } from "@/providers/modal/useModal";
import {
  TIRE_WEAR_RATE_DEFAULT,
  FUEL_CONSUMPTION_RATE_DEFAULT,
  REFUELING_SPEED_DEFAULT,
  INITIAL_FUEL_DEFAULT,
  FINISH_DELAY_DEFAULT,
  MIN_NUM_STOPS_DEFAULT,
  START_TYPE_OPTIONS,
  GRID_ORDER_OPTIONS,
  BOP_TUNING_OPTIONS,
  SETTINGS_OPTIONS,
  BOOST_OPTIONS,
  VISIBLE_DAMAGE_OPTIONS,
  MECHANICAL_DAMAGE_OPTIONS,
  SLIPSTREAM_STRENGTH_OPTIONS,
  TIRE_WEAR_RATE_MIN,
  TIRE_WEAR_RATE_MAX,
  FUEL_CONSUMPTION_RATE_MAX,
  FUEL_CONSUMPTION_RATE_MIN,
  TIRE_WEAR_RATE_STEP,
  FUEL_CONSUMPTION_RATE_STEP,
  TIRE_WEAR_RATE_FORMATTER,
  FUEL_CONSUMPTION_RATE_FORMATTER,
  REFUELING_SPEED_MIN,
  REFUELING_SPEED_MAX,
  REFUELING_SPEED_FORMATTER,
  REFUELING_SPEED_STEP,
  INITIAL_FUEL_MIN,
  INITIAL_FUEL_MAX,
  INITIAL_FUEL_STEP,
  INITIAL_FUEL_FORMATTER,
  GRIP_REDUCTION_OFF_TRACK_OPTIONS,
  FINISH_DELAY_MAX,
  FINISH_DELAY_MIN,
  FINISH_DELAY_STEP,
  FINISH_DELAY_FORMATTER,
  NITRO_OVERTAKE_USAGE_OPTIONS,
  REQ_TIRE_TYPE_CHANGE_OPTIONS,
  MIN_NUM_STOPS_MAX,
  MIN_NUM_STOPS_STEP,
} from "@/lib/constants/raceSettings";
import { useState } from "react";
import FormRow from "@/components/Forms/FormRow/FormRow";
import SelectInput from "@/components/Inputs/SelectInput/SelectInput";
import IncrementInput from "@/components/Inputs/IncrementInput/IncrementInput";
import { withMinDelay } from "@/utils/withMinDelay";

type RaceSettingsProps = {
  formMethods?: UseFormReturn<AdvancedSettingsFormData>;
  setValue?: ReturnType<
    typeof useFormContext<AdvancedSettingsFormData>
  >["setValue"];
};

const RaceSettings = ({ formMethods, setValue: propSetValue }: RaceSettingsProps) => {
  const { closeModal } = useModal();
  const [isSaving, setIsSaving] = useState(false);

  // -- Form Setup -- //

  // This component can be used in two ways:
  // 1. As a standalone form within a modal, in which case it manages its own form state and updates the parent form on close.
  // 2. As a child component within the AdvancedSettings form, in which case it uses the form context provided by the parent and updates values directly on change.
  const fallbackFormMethods = useForm<AdvancedSettingsFormData>({
    defaultValues: {
      startType: "rollingStart",
      gridOrder: "fastestFirst",
      bopTuningProhibited: "true",
      settingsOptions: "brakeBalanceOnly",
      boost: "none",
      slipstreamStrength: "real",
      visibleDamage: "true",
      mechanicalDamage: "real",
      tireWearRate: TIRE_WEAR_RATE_DEFAULT,
      fuelConsumptionRate: FUEL_CONSUMPTION_RATE_DEFAULT,
      refuelingSpeed: REFUELING_SPEED_DEFAULT,
      initialFuel: INITIAL_FUEL_DEFAULT,
      gripReductionOffTrack: "low",
      raceFinishDelay: FINISH_DELAY_DEFAULT,
      minNumStops: MIN_NUM_STOPS_DEFAULT,
      reqTireTypeChange: "false",
      nitroOvertakeUsage: "default",
    },
  });

  const resolvedFormMethods = formMethods ?? fallbackFormMethods;
  const resolvedSetValue = resolvedFormMethods.setValue ?? propSetValue;

  // Watch -> to get real-time values for the increment inputs since they don't update form state on every change
  const tireWearRate = useWatch({
    control: resolvedFormMethods.control,
    name: "tireWearRate",
    defaultValue: TIRE_WEAR_RATE_DEFAULT,
  });

  const fuelConsumptionRate = useWatch({
    control: resolvedFormMethods.control,
    name: "fuelConsumptionRate",
    defaultValue: FUEL_CONSUMPTION_RATE_DEFAULT,
  });

  const refuelingSpeed = useWatch({
    control: resolvedFormMethods.control,
    name: "refuelingSpeed",
    defaultValue: REFUELING_SPEED_DEFAULT,
  });

  const initialFuel = useWatch({
    control: resolvedFormMethods.control,
    name: "initialFuel",
    defaultValue: INITIAL_FUEL_DEFAULT,
  });

  const raceFinishDelay = useWatch({
    control: resolvedFormMethods.control,
    name: "raceFinishDelay",
    defaultValue: FINISH_DELAY_DEFAULT,
  });

  const minNumStops = useWatch({
    control: resolvedFormMethods.control,
    name: "minNumStops",
    defaultValue: MIN_NUM_STOPS_DEFAULT,
  });

  // -- Handlers -- //

  const handleTireWearRateChange = (value: number) => {
    resolvedSetValue?.("tireWearRate", value, { shouldDirty: true });
  };

  const handleFuelConsumptionRateChange = (value: number) => {
    resolvedSetValue?.("fuelConsumptionRate", value, { shouldDirty: true });
  };

  const handleRefuelingSpeedChange = (value: number) => {
    resolvedSetValue?.("refuelingSpeed", value, { shouldDirty: true });
  };

  const handleInitialFuelChange = (value: number) => {
    resolvedSetValue?.("initialFuel", value, { shouldDirty: true });
  };

  const handleRaceFinishDelayChange = (value: number) => {
    resolvedSetValue?.("raceFinishDelay", value, { shouldDirty: true });
  };

  const handleMinNumStopsChange = (value: number) => {
    resolvedSetValue?.("minNumStops", value, { shouldDirty: true });
  };

  const handleOnClose = () => {
    closeModal();
  };

  const handleOnSave = async () => {
    setIsSaving(true);
    try {
      if (!formMethods && propSetValue) {
        const currentValues = resolvedFormMethods.getValues();
        propSetValue("startType", currentValues.startType, { shouldDirty: true });
        propSetValue("gridOrder", currentValues.gridOrder, { shouldDirty: true });
        propSetValue("bopTuningProhibited", currentValues.bopTuningProhibited, { shouldDirty: true });
        propSetValue("settingsOptions", currentValues.settingsOptions, { shouldDirty: true });
        propSetValue("boost", currentValues.boost, { shouldDirty: true });
        propSetValue("slipstreamStrength", currentValues.slipstreamStrength, { shouldDirty: true });
        propSetValue("visibleDamage", currentValues.visibleDamage, { shouldDirty: true });
        propSetValue("mechanicalDamage", currentValues.mechanicalDamage, { shouldDirty: true });
        propSetValue("tireWearRate", currentValues.tireWearRate, { shouldDirty: true });
        propSetValue("fuelConsumptionRate", currentValues.fuelConsumptionRate, { shouldDirty: true });
        propSetValue("refuelingSpeed", currentValues.refuelingSpeed, { shouldDirty: true });
        propSetValue("initialFuel", currentValues.initialFuel, { shouldDirty: true });
        propSetValue("gripReductionOffTrack", currentValues.gripReductionOffTrack, { shouldDirty: true });
        propSetValue("raceFinishDelay", currentValues.raceFinishDelay, { shouldDirty: true });
        propSetValue("minNumStops", currentValues.minNumStops, { shouldDirty: true });
        propSetValue("reqTireTypeChange", currentValues.reqTireTypeChange, { shouldDirty: true });
        propSetValue("nitroOvertakeUsage", currentValues.nitroOvertakeUsage, { shouldDirty: true });
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
        question="Race Settings"
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
            name="startType"
            label="Start Type"
            options={START_TYPE_OPTIONS}
          />
          <SelectInput
            name="gridOrder"
            label="Grid Order"
            options={GRID_ORDER_OPTIONS}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            name="bopTuningProhibited"
            label="BoP / Tuning Prohibited"
            options={BOP_TUNING_OPTIONS}
          />
          <SelectInput
            name="settingsOptions"
            label="Settings Options"
            options={SETTINGS_OPTIONS}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            name="boost"
            label="Boost"
            options={BOOST_OPTIONS}
          />
          <SelectInput
            name="slipstreamStrength"
            label="Slipstream Strength"
            options={SLIPSTREAM_STRENGTH_OPTIONS}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            name="visibleDamage"
            label="Visible Damage"
            options={VISIBLE_DAMAGE_OPTIONS}
          />
          <SelectInput
            name="mechanicalDamage"
            label="Mechanical Damage"
            options={MECHANICAL_DAMAGE_OPTIONS}
          />
        </FormRow>
        <FormRow>
          <IncrementInput 
            name="tireWearRate"
            label="Tire Wear Rate"
            min={TIRE_WEAR_RATE_MIN}
            max={TIRE_WEAR_RATE_MAX}
            step={TIRE_WEAR_RATE_STEP}
            formatter={TIRE_WEAR_RATE_FORMATTER}
            onChange={handleTireWearRateChange}
            value={tireWearRate}
          />
          <IncrementInput 
            name="fuelConsumptionRate"
            label="Fuel Consumption Rate"
            min={FUEL_CONSUMPTION_RATE_MIN}
            max={FUEL_CONSUMPTION_RATE_MAX}
            step={FUEL_CONSUMPTION_RATE_STEP}
            formatter={FUEL_CONSUMPTION_RATE_FORMATTER}
            onChange={handleFuelConsumptionRateChange}
            value={fuelConsumptionRate}
          />
        </FormRow>
        <FormRow>
          <IncrementInput 
            name="refuelingSpeed"
            label="Refueling Speed"
            min={REFUELING_SPEED_MIN}
            max={REFUELING_SPEED_MAX}
            step={REFUELING_SPEED_STEP}
            formatter={REFUELING_SPEED_FORMATTER}
            onChange={handleRefuelingSpeedChange}
            value={refuelingSpeed}
          />
          <IncrementInput 
            name="initialFuel"
            label="Initial Fuel"
            min={INITIAL_FUEL_MIN}
            step={INITIAL_FUEL_STEP}
            max={INITIAL_FUEL_MAX}
            formatter={INITIAL_FUEL_FORMATTER}
            onChange={handleInitialFuelChange}
            value={initialFuel}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            name="gripReductionOffTrack"
            label="Grip Reduction Off Track"
            options={GRIP_REDUCTION_OFF_TRACK_OPTIONS}
          />
          <IncrementInput 
            name="raceFinishDelay"
            label="Race Finish Delay"
            min={FINISH_DELAY_MIN}
            max={FINISH_DELAY_MAX}
            step={FINISH_DELAY_STEP}
            formatter={FINISH_DELAY_FORMATTER}
            onChange={handleRaceFinishDelayChange}
            value={raceFinishDelay}
          />
        </FormRow>
        <FormRow>
          <IncrementInput
            name="minNumStops"
            label="Minimum No. of Pit Stops"
            min={MIN_NUM_STOPS_DEFAULT}
            max={MIN_NUM_STOPS_MAX}
            step={MIN_NUM_STOPS_STEP}
            onChange={handleMinNumStopsChange}
            value={minNumStops}
          />
          <SelectInput
            name="reqTireTypeChange"
            label="Require Tire Type Change"
            options={REQ_TIRE_TYPE_CHANGE_OPTIONS}
          />
        </FormRow>
        <FormRow>
          <SelectInput
            name="nitroOvertakeUsage"
            label="Nitro / Overtaking System Usage Time Multiplier"
            options={NITRO_OVERTAKE_USAGE_OPTIONS}
          />
        </FormRow>
      </FormModal>
    </FormProvider>
  );
};

export default RaceSettings;
