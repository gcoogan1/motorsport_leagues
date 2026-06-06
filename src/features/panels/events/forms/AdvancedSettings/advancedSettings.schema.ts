import { FUEL_CONSUMPTION_RT_QUAL_MAX, FUEL_CONSUMPTION_RT_QUAL_MIN, INITIAL_FUEL_QUAL_MAX, INITIAL_FUEL_QUAL_MIN, QUALIFYING_CONTINUE_TIME_MAX, QUALIFYING_CONTINUE_TIME_MIN, TIME_LIMIT_OPTIONS, TIRE_WEAR_RT_QUAL_MAX, TIRE_WEAR_RT_QUAL_MIN } from "@/lib/constants/qualifierSettings";
import { BOOST_OPTIONS, BOP_TUNING_OPTIONS, FINISH_DELAY_MAX, FINISH_DELAY_MIN, FUEL_CONSUMPTION_RATE_MAX, FUEL_CONSUMPTION_RATE_MIN, GRID_ORDER_OPTIONS, GRIP_REDUCTION_OFF_TRACK_OPTIONS, INITIAL_FUEL_MAX, INITIAL_FUEL_MIN, MECHANICAL_DAMAGE_OPTIONS, MIN_NUM_STOPS_MAX, MIN_NUM_STOPS_MIN, NITRO_OVERTAKE_USAGE_OPTIONS, REFUELING_SPEED_MAX, REFUELING_SPEED_MIN, REQ_TIRE_TYPE_CHANGE_OPTIONS, SETTINGS_OPTIONS, SLIPSTREAM_STRENGTH_OPTIONS, START_TYPE_OPTIONS, TIRE_WEAR_RATE_MAX, TIRE_WEAR_RATE_MIN, VISIBLE_DAMAGE_OPTIONS } from "@/lib/constants/raceSettings";
import {
  PRESET_WEATHER_OPTIONS,
  TIME_OF_DAY_OPTIONS,
  VARIABLE_TIME_SPEED_RATE_MAX,
  VARIABLE_TIME_SPEED_RATE_MIN,
  WEATHER_SELECTION_OPTIONS,
} from "@/lib/constants/timeWeatherSettings";
import * as z from "zod";


// Weather/Time Selection Options
const weatherSelectionOptions = WEATHER_SELECTION_OPTIONS.map((option) => option.value);
const presetWeatherOptions = TIME_OF_DAY_OPTIONS.map((option) => option.value)
  .concat(PRESET_WEATHER_OPTIONS.map((option) => option.value));
const timeOfDayOptions = TIME_OF_DAY_OPTIONS.map((option) => option.value);

// Race Settings Selection Options
const startTypeOptions = START_TYPE_OPTIONS.map((option) => option.value);
const gridOrderOptions = GRID_ORDER_OPTIONS.map((option) => option.value);
const bopTuningOptions = BOP_TUNING_OPTIONS.map((option) => option.value);
const settingsOptions = SETTINGS_OPTIONS.map((option) => option.value);
const boostOptions = BOOST_OPTIONS.map((option) => option.value);
const slipstreamStrengthOptions = SLIPSTREAM_STRENGTH_OPTIONS.map((option) => option.value);
const visibleDamageOptions = VISIBLE_DAMAGE_OPTIONS.map((option) => option.value);
const mechanicalDamageOptions = MECHANICAL_DAMAGE_OPTIONS.map((option) => option.value);
const gripReductionOffTrackOptions = GRIP_REDUCTION_OFF_TRACK_OPTIONS.map((option) => option.value);
const reqTireTypeChangeOptions = REQ_TIRE_TYPE_CHANGE_OPTIONS.map((option) => option.value);
const nitroOvertakeUsageOptions = NITRO_OVERTAKE_USAGE_OPTIONS.map((option) => option.value);

// Qualifier Settings Selection Options
const timeLimitOptions = TIME_LIMIT_OPTIONS.map((option) => option.value);
const slipstreamStrengthQualOptions = SLIPSTREAM_STRENGTH_OPTIONS.map((option) => option.value);




export const advancedSettingsSchema = z.object({
  revealAdvancedSettings: z.boolean(),

  // Time/Weather Settings
  weatherSelection: z.enum(weatherSelectionOptions).optional(),
  presetWeather: z.enum(presetWeatherOptions).optional(),
  customWeather: z.string().optional(),
  timeOfDay: z.enum(timeOfDayOptions).optional(),
  equalCondition: z.enum(["false", "true"]).optional(),
  variableTimeSpeedRate: z.number().min(VARIABLE_TIME_SPEED_RATE_MIN).max(
    VARIABLE_TIME_SPEED_RATE_MAX,
  ).optional(),

  // Race Settings
  startType: z.enum(startTypeOptions).optional(),
  gridOrder: z.enum(gridOrderOptions).optional(),
  bopTuningProhibited: z.enum(bopTuningOptions).optional(),
  settingsOptions: z.enum(settingsOptions).optional(),
  boost: z.enum(boostOptions).optional(),
  slipstreamStrength: z.enum(slipstreamStrengthOptions).optional(),
  visibleDamage: z.enum(visibleDamageOptions).optional(),
  mechanicalDamage: z.enum(mechanicalDamageOptions).optional(),
  tireWearRate: z.number().min(TIRE_WEAR_RATE_MIN).max(TIRE_WEAR_RATE_MAX).optional(),
  fuelConsumptionRate: z.number().min(FUEL_CONSUMPTION_RATE_MIN).max(FUEL_CONSUMPTION_RATE_MAX).optional(),
  refuelingSpeed: z.number().min(REFUELING_SPEED_MIN).max(REFUELING_SPEED_MAX).optional(),
  initialFuel: z.number().min(INITIAL_FUEL_MIN).max(INITIAL_FUEL_MAX).optional(),
  gripReductionOffTrack: z.enum(gripReductionOffTrackOptions).optional(),
  raceFinishDelay: z.number().min(FINISH_DELAY_MIN).max(FINISH_DELAY_MAX).optional(),
  minNumStops: z.number().min(MIN_NUM_STOPS_MIN).max(MIN_NUM_STOPS_MAX).optional(),
  reqTireTypeChange: z.enum(reqTireTypeChangeOptions).optional(),
  nitroOvertakeUsage: z.enum(nitroOvertakeUsageOptions).optional(),

  // Qualifying Settings
  timeLimit: z.enum(timeLimitOptions).optional(),
  qualContinTime: z.number().min(QUALIFYING_CONTINUE_TIME_MIN).max(QUALIFYING_CONTINUE_TIME_MAX).optional(),
  tireWearRtQual: z.number().min(TIRE_WEAR_RT_QUAL_MIN).max(TIRE_WEAR_RT_QUAL_MAX).optional(),
  fuelConsumptionRtQual: z.number().min(FUEL_CONSUMPTION_RT_QUAL_MIN).max(FUEL_CONSUMPTION_RT_QUAL_MAX).optional(),
  initialFuelQual: z.number().min(INITIAL_FUEL_QUAL_MIN).max(INITIAL_FUEL_QUAL_MAX).optional(),
  slipstreamStrengthQual: z.enum(slipstreamStrengthQualOptions).optional(),
});

export type AdvancedSettingsFormData = z.infer<typeof advancedSettingsSchema>;