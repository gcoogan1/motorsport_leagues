import { FormProvider, useForm, useWatch } from "react-hook-form";
import EditIcon from "@assets/Icon/Edit.svg?react";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import type { AdvancedSettingsFormData } from "./advancedSettings.schema";
import { useModal } from "@/providers/modal/useModal";
import PanelForm from "@/components/Forms/PanelForm/PanelForm";
import Button from "@/components/Button/Button";
import TimeWeather from "../../modals/chore/TimeWeather/TimeWeather";
import { FINISH_DELAY_DEFAULT, FUEL_CONSUMPTION_RATE_DEFAULT, INITIAL_FUEL_DEFAULT, MIN_NUM_STOPS_DEFAULT, REFUELING_SPEED_DEFAULT, TIRE_WEAR_RATE_DEFAULT } from "@/lib/constants/raceSettings";
import RaceSettings from "../../modals/chore/RaceSettings/RaceSettings";
import { FUEL_CONSUMPTION_RT_QUAL_DEFAULT, INITIAL_FUEL_QUAL_DEFAULT, QUALIFYING_CONTINUE_TIME_DEFAULT, TIRE_WEAR_RT_QUAL_DEFAULT } from "@/lib/constants/qualifierSettings";
import QualifierSettings from "../../modals/chore/QualifierSettings/QualifierSettings";

type AdvancedSettingsProps = {
  eventId: string;
}

const AdvancedSettings = ({ eventId }: AdvancedSettingsProps) => {

  const { openModal } = useModal();

  const formMethods = useForm<AdvancedSettingsFormData>({
    defaultValues: {
      revealAdvancedSettings: false,
      weatherSelection: "presetWeatherSelection",
      presetWeather: "s01",
      timeOfDay: "earlyMorning",
      equalCondition: "true",
      variableTimeSpeedRate: 1,

      startType: "gridStart",
      gridOrder: "fastestFirst",
      bopTuningProhibited: "false",
      settingsOptions: "some",
      boost: "none",
      slipstreamStrength: "real",
      visibleDamage: "true",
      mechanicalDamage: "none",
      tireWearRate: TIRE_WEAR_RATE_DEFAULT,
      fuelConsumptionRate: FUEL_CONSUMPTION_RATE_DEFAULT,
      refuelingSpeed: REFUELING_SPEED_DEFAULT,
      initialFuel: INITIAL_FUEL_DEFAULT,
      gripReductionOffTrack: "low",
      raceFinishDelay: FINISH_DELAY_DEFAULT,
      minNumStops: MIN_NUM_STOPS_DEFAULT,
      reqTireTypeChange: "false",
      nitroOvertakeUsage: "default",

      timeLimit: "10min",
      qualContinTime: QUALIFYING_CONTINUE_TIME_DEFAULT,
      tireWearRtQual: TIRE_WEAR_RT_QUAL_DEFAULT,
      fuelConsumptionRtQual: FUEL_CONSUMPTION_RT_QUAL_DEFAULT,
      initialFuelQual: INITIAL_FUEL_QUAL_DEFAULT,
      slipstreamStrengthQual: "real",

    },
  });

  const {
    handleSubmit,
    setValue,
    control,
  } = formMethods;

  const revealAdvancedSettings = useWatch({
    control,
    name: "revealAdvancedSettings",
    defaultValue: true,
  });
  const weatherSelection = useWatch({
    control,
    name: "weatherSelection",
    defaultValue: "presetWeatherSelection",
  });

  const handleRevealAdvancedSettingsChange = () => {
    setValue("revealAdvancedSettings", !revealAdvancedSettings, {
      shouldDirty: true,
    });
  };

  // -- Handlers -- //

  const handleTimeWeatherSettingsClick = () => {
    openModal(<TimeWeather setValue={setValue} weatherSelection={weatherSelection} formMethods={formMethods} />);
    return;
  }

  const handleRaceSettingsClick = () => {
    openModal(<RaceSettings setValue={setValue} formMethods={formMethods} />);
    return;
  }

  const handleQualifierSettingsClick = () => {
    openModal(<QualifierSettings setValue={setValue} formMethods={formMethods} />);
    return;
  }

  const handleSave = handleSubmit(
    async (data) => {
      try {
        console.log("Validated Form Data:", data);
        // Perform save operation here
      } catch (error) {
        console.error(error);
      }
    }
  );

  return (
    <FormProvider {...formMethods}>
      <PanelLayout
        panelTitle="Advanced Settings"
        panelTitleIcon={<EditIcon />}
        actions={{
          primary: {
            label: "Save",
            action: handleSave,
            color: "primary",
          },
        }}
      >
        <PanelForm
          title="Advanced Settings"
          hasMultiple
          checkboxOption={{
            name: "revealAdvancedSettings",
            label: 'Don\'t Reveal',
            checked: !revealAdvancedSettings,
            onChange: handleRevealAdvancedSettingsChange,
          }}
        >
          <Button
            color="base"
            fullWidth
            onClick={handleTimeWeatherSettingsClick}
          >
            Time / Weather Settings
          </Button>
          <Button
            color="base"
            fullWidth
            onClick={handleRaceSettingsClick}
          >
            Race Settings
          </Button>
          <Button
            color="base"
            fullWidth
            onClick={handleQualifierSettingsClick}
          >
            Qualifier Settings
          </Button>
        </PanelForm>
      </PanelLayout>
    </FormProvider>
  )
}

export default AdvancedSettings