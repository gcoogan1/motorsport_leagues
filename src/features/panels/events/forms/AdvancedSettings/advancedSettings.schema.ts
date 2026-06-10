import { FUEL_CONSUMPTION_RT_QUAL_MAX, FUEL_CONSUMPTION_RT_QUAL_MIN, INITIAL_FUEL_QUAL_MAX, INITIAL_FUEL_QUAL_MIN, QUALIFYING_CONTINUE_TIME_MAX, QUALIFYING_CONTINUE_TIME_MIN, TIME_LIMIT_OPTIONS, TIRE_WEAR_RT_QUAL_MAX, TIRE_WEAR_RT_QUAL_MIN } from "@/lib/constants/qualifierSettings";
import { BOOST_OPTIONS, BOP_TUNING_OPTIONS, FINISH_DELAY_MAX, FINISH_DELAY_MIN, FUEL_CONSUMPTION_RATE_MAX, FUEL_CONSUMPTION_RATE_MIN, GRID_ORDER_OPTIONS, GRIP_REDUCTION_OFF_TRACK_OPTIONS, INITIAL_FUEL_MAX, INITIAL_FUEL_MIN, MECHANICAL_DAMAGE_OPTIONS, MIN_NUM_STOPS_MAX, MIN_NUM_STOPS_MIN, NITRO_OVERTAKE_USAGE_OPTIONS, REFUELING_SPEED_MAX, REFUELING_SPEED_MIN, REQ_TIRE_TYPE_CHANGE_OPTIONS, SETTINGS_OPTIONS, SLIPSTREAM_STRENGTH_OPTIONS, START_TYPE_OPTIONS, TIRE_WEAR_RATE_MAX, TIRE_WEAR_RATE_MIN, VISIBLE_DAMAGE_OPTIONS } from "@/lib/constants/raceSettings";
import { FILTER_BY_CATEGORY_OPTIONS, NITROUS_OPTIONS, KART_USAGE_OPTIONS, ENGINE_SWAP_OPTIONS, TUNING_PARTS_OPTIONS, DRIVETRAIN_OPTIONS, ASPIRATION_OPTIONS, USABLE_TIRE_OPTIONS, REQUIRED_TIRE_TYPE_OPTIONS, USABLE_TIRE_WEAR_OPTIONS, MAX_POWER_OUTPUT_MAX, MAX_POWER_OUTPUT_MIN, MIN_WEIGHT_MAX, MIN_WEIGHT_MIN, PP_LIMIT_MAX, PP_LIMIT_MIN, YEAR_UPPER_LIMIT_MAX, YEAR_LOWER_LIMIT_MAX, YEAR_LOWER_LIMIT_MIN, YEAR_UPPER_LIMIT_MIN } from "@/lib/constants/regulationSettings";
import {
  PRESET_WEATHER_OPTIONS,
  TIME_OF_DAY_OPTIONS,
  VARIABLE_TIME_SPEED_RATE_MAX,
  VARIABLE_TIME_SPEED_RATE_MIN,
  WEATHER_SELECTION_OPTIONS,
} from "@/lib/constants/timeWeatherSettings";
import * as z from "zod";
import { CAR_COLLISION_PENALTY_OPTIONS, CORRECT_VEHICLE_COURSE_OPTIONS, FLAG_RULES_OPTIONS, GHOSTING_DURING_RACE_OPTIONS, PIT_LANE_LINE_CUT_OPTIONS, SHORTCUT_PENALTY_OPTIONS, WALL_COLLISION_PENALTY_OPTIONS } from "@/lib/constants/penaltySettings";
import { COUNTERSTEERING_ASSIST_OPTIONS, ACTIVE_STABILITY_MANAGE_OPTIONS, TRACTION_CONTROL_OPTIONS, ABS_OPTIONS, AUTO_DRIVE_OPTIONS, DRIVING_LINE_ASSIST_OPTIONS } from "@/lib/constants/assistsSettings";


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

// Regulation Settings Selection Options
const filterByCategoryOptions = FILTER_BY_CATEGORY_OPTIONS.map((option) => option.value);
const usableTireOptions = USABLE_TIRE_OPTIONS.map((option) => option.value);
const usableTireWearOptions = USABLE_TIRE_WEAR_OPTIONS.map((option) => option.value);
const reqTireTypeOptions = REQUIRED_TIRE_TYPE_OPTIONS.map((option) => option.value);
const nitrousOptions = NITROUS_OPTIONS.map((option) => option.value);
const kartUsageOptions = KART_USAGE_OPTIONS.map((option) => option.value);
const engineSwapOptions = ENGINE_SWAP_OPTIONS.map((option) => option.value);
const tuningPartsOptions = TUNING_PARTS_OPTIONS.map((option) => option.value);
const drivetrainOptions = DRIVETRAIN_OPTIONS.map((option) => option.value);
const aspirationOptions = ASPIRATION_OPTIONS.map((option) => option.value);

// Penalty Settings Selection Options
const shortcutPenaltyOptions = SHORTCUT_PENALTY_OPTIONS.map((option) => option.value);
const wallCollPenaltyOptions = WALL_COLLISION_PENALTY_OPTIONS.map((option) => option.value); 
const correctVehicleCourseOptions = CORRECT_VEHICLE_COURSE_OPTIONS.map((option) => option.value); 
const carCollPenaltyOptions = CAR_COLLISION_PENALTY_OPTIONS.map((option) => option.value);
const pitLaneLineCutOptions = PIT_LANE_LINE_CUT_OPTIONS.map((option) => option.value);
const ghostingDuringRaceOptions = GHOSTING_DURING_RACE_OPTIONS.map((option) => option.value);
const flagRulesOptions = FLAG_RULES_OPTIONS.map((option) => option.value);


// Assist Settings Selection Options
const countersteeringAssistOptions = COUNTERSTEERING_ASSIST_OPTIONS.map((option) => option.value);
const activeStabilityManageOptions = ACTIVE_STABILITY_MANAGE_OPTIONS.map((option) => option.value);
const drivingLineAssistOptions = DRIVING_LINE_ASSIST_OPTIONS.map((option) => option.value);
const tractionControlOptions = TRACTION_CONTROL_OPTIONS.map((option) => option.value);
const absOptions = ABS_OPTIONS.map((option) => option.value);
const autoDriveOptions = AUTO_DRIVE_OPTIONS.map((option) => option.value);


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

  // Regulation Settings
  filterCategory: z.enum(filterByCategoryOptions).optional(),
  ppLimit: z.number().min(PP_LIMIT_MIN).max(PP_LIMIT_MAX).optional(),
  maxPowerOutput: z.number().min(MAX_POWER_OUTPUT_MIN).max(MAX_POWER_OUTPUT_MAX).optional(),
  minWeight: z.number().min(MIN_WEIGHT_MIN).max(MIN_WEIGHT_MAX).optional(),
  usableTires: z.enum(usableTireOptions).optional(),
  usableTiresTypes: z.array(z.enum(usableTireWearOptions)).optional(),
  reqTireType: z.array(z.enum(reqTireTypeOptions)).optional(),
  nitrous: z.enum(nitrousOptions).optional(),
  kartUsage: z.enum(kartUsageOptions).optional(),
  engineSwap: z.enum(engineSwapOptions).optional(),
  tuningParts: z.enum(tuningPartsOptions).optional(),
  yearLowerLimit: z.number().min(YEAR_LOWER_LIMIT_MIN).max(YEAR_LOWER_LIMIT_MAX).optional(),
  yearUpperLimit: z.number().min(YEAR_UPPER_LIMIT_MIN).max(YEAR_UPPER_LIMIT_MAX).optional(),
  drivetrain: z.enum(drivetrainOptions).optional(),
  aspiration: z.enum(aspirationOptions).optional(),

  // Penalty Settings
  shortcutPenalty: z.enum(shortcutPenaltyOptions).optional(),
  wallCollPenalty: z.enum(wallCollPenaltyOptions).optional(),
  correctVehicleCourse: z.enum(correctVehicleCourseOptions).optional(),
  carCollPenalty: z.enum(carCollPenaltyOptions).optional(),
  pitLaneLineCutPenalty: z.enum(pitLaneLineCutOptions).optional(),
  ghostingDuringRace: z.enum(ghostingDuringRaceOptions).optional(),
  flagRules: z.enum(flagRulesOptions).optional(),

  // Assist Settings
  countersteeringAssist: z.enum(countersteeringAssistOptions).optional(),
  activeStabilityManage: z.enum(activeStabilityManageOptions).optional(),
  drivingLineAssist: z.enum(drivingLineAssistOptions).optional(),
  tractionControl: z.enum(tractionControlOptions).optional(),
  abs: z.enum(absOptions).optional(),
  autoDrive: z.enum(autoDriveOptions).optional(),

});

export type AdvancedSettingsFormData = z.infer<typeof advancedSettingsSchema>;