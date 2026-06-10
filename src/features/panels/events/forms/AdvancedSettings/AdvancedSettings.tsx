import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useModal } from "@/providers/modal/useModal";
import { usePanel } from "@/providers/panel/usePanel";
import { useToast } from "@/providers/toast/useToast";
import EditIcon from "@assets/Icon/Edit.svg?react";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";
import PanelForm from "@/components/Forms/PanelForm/PanelForm";
import Button from "@/components/Button/Button";
import UnsavedChanges from "@/features/leagues/modals/errors/UnsavedChanges/UnsavedChanges";
import TimeWeather from "../../modals/chore/TimeWeather/TimeWeather";
import QualifierSettings from "../../modals/chore/QualifierSettings/QualifierSettings";
import RaceSettings from "../../modals/chore/RaceSettings/RaceSettings";
import RegulationSettings from "../../modals/chore/RegulationSettings/RegulationSettings";
import PenaltySettings from "../../modals/chore/PenaltySettings/PenaltySettings";
import AssistsSettings from "../../modals/chore/AssistsSettings/AssistsSettings";
import { FUEL_CONSUMPTION_RT_QUAL_DEFAULT, INITIAL_FUEL_QUAL_DEFAULT, QUALIFYING_CONTINUE_TIME_DEFAULT, TIRE_WEAR_RT_QUAL_DEFAULT } from "@/lib/constants/qualifierSettings";
import { FINISH_DELAY_DEFAULT, FUEL_CONSUMPTION_RATE_DEFAULT, INITIAL_FUEL_DEFAULT, MIN_NUM_STOPS_DEFAULT, REFUELING_SPEED_DEFAULT, TIRE_WEAR_RATE_DEFAULT } from "@/lib/constants/raceSettings";
import { PP_LIMIT_DEFAULT, MAX_POWER_OUTPUT_DEFAULT, MIN_WEIGHT_DEFAULT, YEAR_LOWER_LIMIT_DEFAULT, YEAR_UPPER_LIMIT_DEFAULT } from "@/lib/constants/regulationSettings";
import type { AdvancedSettingsFormData } from "./advancedSettings.schema";
import { useCreateEventAdvancedSettings, useUpdateEventAdvancedSettings } from "@/rtkQuery/hooks/mutations/useEventAdvancedSettingsMutation";
import { useGetEventAdvancedSettings } from "@/rtkQuery/hooks/queries/useEventAdvancedSettings";
import type { CreateEventAdvancedSettingsPayload } from "@/types/eventAdvancedSettings";
import { useCallback, useEffect, useMemo, useState } from "react";
import { withMinDelay } from "@/utils/withMinDelay";
import { handleSupabaseError } from "@/utils/handleSupabaseErrors";

type AdvancedSettingsProps = {
  eventId: string;
}

const AdvancedSettings = ({ eventId }: AdvancedSettingsProps) => {

  const { openModal } = useModal();
  const { closePanel, setOutsidePanelCloseHandler } = usePanel();
  const { showToast } = useToast();
  const { data: existingAdvancedSettings } = useGetEventAdvancedSettings(eventId);
  const [createAdvancedSettings] = useCreateEventAdvancedSettings();
  const [updateAdvancedSettings] = useUpdateEventAdvancedSettings();
  const [isSaving, setIsSaving] = useState(false);

  const parseStringArray = (value: unknown, fallback: string[]): string[] => {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string");
    }

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.filter((item): item is string => typeof item === "string");
        }
      } catch {
        // Fall back to defaults when legacy values are not valid JSON arrays.
      }
    }

    return fallback;
  };

  const defaultValues = useMemo<AdvancedSettingsFormData>(() => ({
      revealAdvancedSettings: true,
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

      filterCategory: "gr3",
      ppLimit: PP_LIMIT_DEFAULT,
      maxPowerOutput: MAX_POWER_OUTPUT_DEFAULT,
      minWeight: MIN_WEIGHT_DEFAULT,
      usableTires: "noLimit",
      usableTiresTypes: ["hard"],
      reqTireType: ["hard"],
      nitrous: "prohibited",
      kartUsage: "false",
      engineSwap: "unrestricted",
      tuningParts: "unrestricted",
      yearLowerLimit: YEAR_LOWER_LIMIT_DEFAULT,
      yearUpperLimit: YEAR_UPPER_LIMIT_DEFAULT,
      drivetrain: "unrestricted",
      aspiration: "unrestricted",

      shortcutPenalty: "weak",
      wallCollPenalty: "off",
      correctVehicleCourse: "true",
      carCollPenalty: "false",
      pitLaneLineCutPenalty: "true",
      ghostingDuringRace: "weak",
      flagRules: "true",

      countersteeringAssist: "noLimit",
      activeStabilityManage: "noLimit",
      drivingLineAssist: "noLimit",
      tractionControl: "noLimit",
      abs: "noLimit",
      autoDrive: "noLimit",

      ...((existingAdvancedSettings
        ? {
            revealAdvancedSettings:
            existingAdvancedSettings.reveal_advanced_settings ?? false,
            weatherSelection: existingAdvancedSettings.weather_selection ?? "presetWeatherSelection",
            presetWeather: existingAdvancedSettings.preset_weather ?? "s01",
            customWeather: existingAdvancedSettings.custom_weather ?? "",
            timeOfDay: existingAdvancedSettings.time_of_day ?? "earlyMorning",
            equalCondition: (existingAdvancedSettings.equal_con_mode ?? "true") as AdvancedSettingsFormData["equalCondition"],
            variableTimeSpeedRate: Number(existingAdvancedSettings.variable_time_speed_rate ?? 1),
            startType: existingAdvancedSettings.start_type ?? "gridStart",
            gridOrder: existingAdvancedSettings.grid_order ?? "fastestFirst",
            bopTuningProhibited: existingAdvancedSettings.bop_tuning_prohibited ?? "false",
            settingsOptions: existingAdvancedSettings.settings_options ?? "some",
            boost: existingAdvancedSettings.boost ?? "none",
            slipstreamStrength: existingAdvancedSettings.slipstream_strength ?? "real",
            visibleDamage: existingAdvancedSettings.visible_damage ?? "true",
            mechanicalDamage: existingAdvancedSettings.mechanical_damage ?? "none",
            tireWearRate: existingAdvancedSettings.tire_wear_rate ?? TIRE_WEAR_RATE_DEFAULT,
            fuelConsumptionRate: existingAdvancedSettings.fuel_consumption_rate ?? FUEL_CONSUMPTION_RATE_DEFAULT,
            refuelingSpeed: existingAdvancedSettings.refueling_speed ?? REFUELING_SPEED_DEFAULT,
            initialFuel: existingAdvancedSettings.initial_fuel ?? INITIAL_FUEL_DEFAULT,
            gripReductionOffTrack: existingAdvancedSettings.grip_reduction_off_track ?? "low",
            raceFinishDelay: existingAdvancedSettings.race_finish_delay ?? FINISH_DELAY_DEFAULT,
            minNumStops: existingAdvancedSettings.min_num_stops ?? MIN_NUM_STOPS_DEFAULT,
            reqTireTypeChange: existingAdvancedSettings.req_tire_type_change ?? "false",
            nitroOvertakeUsage: existingAdvancedSettings.nitro_overtake_usage ?? "default",
            timeLimit: existingAdvancedSettings.time_limit ?? "10min",
            qualContinTime: existingAdvancedSettings.qual_contin_time ?? QUALIFYING_CONTINUE_TIME_DEFAULT,
            tireWearRtQual: existingAdvancedSettings.tire_wear_rt_qual ?? TIRE_WEAR_RT_QUAL_DEFAULT,
            fuelConsumptionRtQual:
              existingAdvancedSettings.fuel_consumption_rt_qual ?? FUEL_CONSUMPTION_RT_QUAL_DEFAULT,
            initialFuelQual: existingAdvancedSettings.initial_fuel_qual ?? INITIAL_FUEL_QUAL_DEFAULT,
            slipstreamStrengthQual: existingAdvancedSettings.slipstream_strength_qual ?? "real",
            filterCategory: existingAdvancedSettings.filter_category ?? "gr3",
            ppLimit: existingAdvancedSettings.pp_limit ?? PP_LIMIT_DEFAULT,
            maxPowerOutput: existingAdvancedSettings.max_power_output ?? MAX_POWER_OUTPUT_DEFAULT,
            minWeight: existingAdvancedSettings.min_weight ?? MIN_WEIGHT_DEFAULT,
            usableTires: existingAdvancedSettings.usable_tires ?? "noLimit",
            usableTiresTypes: parseStringArray(existingAdvancedSettings.usable_tires_types, ["hard"]),
            reqTireType: parseStringArray(existingAdvancedSettings.req_tire_type, ["hard"]),
            nitrous: existingAdvancedSettings.nitrous ?? "prohibited",
            kartUsage: existingAdvancedSettings.kart_usage ?? "false",
            engineSwap: existingAdvancedSettings.engine_swap ?? "unrestricted",
            tuningParts: existingAdvancedSettings.tuning_parts ?? "unrestricted",
            yearLowerLimit: existingAdvancedSettings.year_lower_limit ?? YEAR_LOWER_LIMIT_DEFAULT,
            yearUpperLimit: existingAdvancedSettings.year_upper_limit ?? YEAR_UPPER_LIMIT_DEFAULT,
            drivetrain: existingAdvancedSettings.drivetrain ?? "unrestricted",
            aspiration: existingAdvancedSettings.aspiration ?? "unrestricted",
            shortcutPenalty: existingAdvancedSettings.shortcut_penalty ?? "weak",
            wallCollPenalty: existingAdvancedSettings.wall_coll_penalty ?? "off",
            correctVehicleCourse: existingAdvancedSettings.correct_vehicle_course ?? "true",
            carCollPenalty: existingAdvancedSettings.car_coll_penalty ?? "false",
            pitLaneLineCutPenalty: existingAdvancedSettings.pit_lane_line_cut_penalty ?? "true",
            ghostingDuringRace: existingAdvancedSettings.ghosting_during_race ?? "weak",
            flagRules: existingAdvancedSettings.flag_rules ?? "true",
            countersteeringAssist: existingAdvancedSettings.countersteering_assist ?? "noLimit",
            activeStabilityManage: existingAdvancedSettings.active_stability_manage ?? "noLimit",
            drivingLineAssist: existingAdvancedSettings.driving_line_assist ?? "noLimit",
            tractionControl: existingAdvancedSettings.traction_control ?? "noLimit",
            abs: existingAdvancedSettings.abs ?? "noLimit",
            autoDrive: existingAdvancedSettings.auto_drive ?? "noLimit",
          }
        : {}) as Partial<AdvancedSettingsFormData>),
  }), [existingAdvancedSettings]);

  const formMethods = useForm<AdvancedSettingsFormData>({
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { isDirty },
  } = formMethods;

  useEffect(() => {
    if (isDirty) return;
    reset(defaultValues);
  }, [defaultValues, isDirty, reset]);

  const revealAdvancedSettings = useWatch({
    control,
    name: "revealAdvancedSettings",
    defaultValue: true,
  });

  const handleRevealAdvancedSettingsChange = () => {
    setValue("revealAdvancedSettings", !revealAdvancedSettings, {
      shouldDirty: true,
    });
  };

  const handleAttemptClose = useCallback(() => {
    if (!isDirty) {
      closePanel();
      return;
    }

    openModal(
      <UnsavedChanges
        onDiscard={() => {
          reset(defaultValues);
          closePanel();
        }}
      />,
    );
  }, [closePanel, defaultValues, isDirty, openModal, reset]);

  useEffect(() => {
    setOutsidePanelCloseHandler(handleAttemptClose);

    return () => {
      setOutsidePanelCloseHandler(null);
    };
  }, [handleAttemptClose, setOutsidePanelCloseHandler]);
  

  // -- Handlers -- //

  const handleModalOpen = (type: "timeWeather" | "raceSettings" | "qualifierSettings" | "regulationSettings" | "penaltySettings" | "assistsSettings") => {
    switch (type) {
      case "timeWeather":
        return openModal(<TimeWeather setValue={setValue} formMethods={formMethods} />);
      case "raceSettings":
        return openModal(<RaceSettings setValue={setValue} formMethods={formMethods} />);
      case "qualifierSettings":
        return openModal(<QualifierSettings setValue={setValue} formMethods={formMethods} />);
      case "regulationSettings":
        return openModal(<RegulationSettings setValue={setValue} formMethods={formMethods} />);
      case "penaltySettings":
        return openModal(<PenaltySettings setValue={setValue} formMethods={formMethods} />);
      case "assistsSettings":
        return openModal(<AssistsSettings setValue={setValue} formMethods={formMethods} />);
      default:
        return;
    }
  }

  const toPayload = (data: AdvancedSettingsFormData): CreateEventAdvancedSettingsPayload => ({
    eventId,
    revealAdvancedSettings: data.revealAdvancedSettings,
    weatherSelection: data.weatherSelection,
    presetWeather: data.presetWeather,
    customWeather: data.customWeather,
    timeOfDay: data.timeOfDay,
    equalConMode: data.equalCondition,
    variableTimeSpeedRate: String(data.variableTimeSpeedRate ?? 1),
    startType: data.startType,
    gridOrder: data.gridOrder,
    bopTuningProhibited: data.bopTuningProhibited,
    settingsOptions: data.settingsOptions,
    boost: data.boost,
    slipstreamStrength: data.slipstreamStrength,
    visibleDamage: data.visibleDamage,
    mechanicalDamage: data.mechanicalDamage,
    tireWearRate: data.tireWearRate,
    fuelConsumptionRate: data.fuelConsumptionRate,
    refuelingSpeed: data.refuelingSpeed,
    initialFuel: data.initialFuel,
    gripReductionOffTrack: data.gripReductionOffTrack,
    raceFinishDelay: data.raceFinishDelay,
    minNumStops: data.minNumStops,
    reqTireTypeChange: data.reqTireTypeChange,
    nitroOvertakeUsage: data.nitroOvertakeUsage,
    timeLimit: data.timeLimit,
    qualContinTime: data.qualContinTime,
    tireWearRtQual: data.tireWearRtQual,
    fuelConsumptionRtQual: data.fuelConsumptionRtQual,
    initialFuelQual: data.initialFuelQual,
    slipstreamStrengthQual: data.slipstreamStrengthQual,
    filterCategory: data.filterCategory,
    ppLimit: data.ppLimit,
    maxPowerOutput: data.maxPowerOutput,
    minWeight: data.minWeight,
    usableTires: data.usableTires,
    usableTiresTypes: JSON.stringify(data.usableTiresTypes ?? []),
    reqTireType: JSON.stringify(data.reqTireType ?? []),
    nitrous: data.nitrous,
    kartUsage: data.kartUsage,
    engineSwap: data.engineSwap,
    tuningParts: data.tuningParts,
    yearLowerLimit: data.yearLowerLimit,
    yearUpperLimit: data.yearUpperLimit,
    drivetrain: data.drivetrain,
    aspiration: data.aspiration,
    shortcutPenalty: data.shortcutPenalty,
    wallCollPenalty: data.wallCollPenalty,
    correctVehicleCourse: data.correctVehicleCourse,
    carCollPenalty: data.carCollPenalty,
    pitLaneLineCutPenalty: data.pitLaneLineCutPenalty,
    ghostingDuringRace: data.ghostingDuringRace,
    flagRules: data.flagRules,
    countersteeringAssist: data.countersteeringAssist,
    activeStabilityManage: data.activeStabilityManage,
    drivingLineAssist: data.drivingLineAssist,
    tractionControl: data.tractionControl,
    abs: data.abs,
    autoDrive: data.autoDrive,
  });

  const handleSave = handleSubmit(
    async (data) => {
      try {
        setIsSaving(true);
        const payload = toPayload(data);

        await withMinDelay(
          (async () => {
            if (existingAdvancedSettings) {
              await updateAdvancedSettings({ payload }).unwrap();
            } else {
              await createAdvancedSettings({ payload }).unwrap();
            }
          })(),
          600,
        );

        reset(data);
        showToast({ usage: "success", message: "Advanced settings saved." });
        closePanel();
      } catch {
        handleSupabaseError({ code: "SERVER_ERROR" }, openModal);
      } finally {
        setIsSaving(false);
      }
    }
  );

  return (
    <FormProvider {...formMethods}>
      <PanelLayout
        panelTitle="Advanced Settings"
        panelTitleIcon={<EditIcon />}
        onClose={handleAttemptClose}
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
            onClick={() => handleModalOpen("timeWeather")}
          >
            Time / Weather Settings
          </Button>
          <Button
            color="base"
            fullWidth
            onClick={() => handleModalOpen("raceSettings")}
          >
            Race Settings
          </Button>
          <Button
            color="base"
            fullWidth
            onClick={() => handleModalOpen("qualifierSettings")}
          >
            Qualifier Settings
          </Button>
          <Button
            color="base"
            fullWidth
            onClick={() => handleModalOpen("regulationSettings")}
          >
            Regulation Settings
          </Button>
          <Button
            color="base"
            fullWidth
            onClick={() => handleModalOpen("penaltySettings")}
          >
            Penalty Settings
          </Button>
          <Button
            color="base"
            fullWidth
            onClick={() => handleModalOpen("assistsSettings")}
          >
            Driving Options Limitations
          </Button>
        </PanelForm>
      </PanelLayout>
    </FormProvider>
  );
}

export default AdvancedSettings