export type EventAdvancedSettingsTable = {
  id: string;
  created_at: string;
  event_id: string;
  reveal_advanced_settings?: boolean;
  // Time/Weather Settings
  weather_selection?: string;
  preset_weather?: string;
  custom_weather?: string;
  time_of_day?: string;
  equal_con_mode?: string;
  variable_time_speed_rate?: string;
  // Race Settings
  start_type?: string;
  grid_order?: string;
  bop_tuning_prohibited?: string;
  settings_options?: string;
  boost?: string;
  slipstream_strength?: string;
  visible_damage?: string;
  mechanical_damage?: string;
  tire_wear_rate?: number;
  fuel_consumption_rate?: number;
  refueling_speed?: number;
  initial_fuel?: number;
  grip_reduction_off_track?: string;
  race_finish_delay?: number;
  min_num_stops?: number;
  req_tire_type_change?: string;
  nitro_overtake_usage?: string;
  // Qualifier Settings
  time_limit?: string;
  qual_contin_time?: number;
  tire_wear_rt_qual?: number;
  fuel_consumption_rt_qual?: number;
  initial_fuel_qual?: number;
  slipstream_strength_qual?: string;
  // Regulation Settings
  filter_category?: string;
  pp_limit?: number;
  max_power_output?: number;
  min_weight?: number;
  usable_tires?: string;
  usable_tires_types?: string;
  req_tire_type?: string;
  nitrous?: string;
  kart_usage?: string;
  engine_swap?: string;
  tuning_parts?: string;
  year_lower_limit?: number;
  year_upper_limit?: number;
  drivetrain?: string;
  aspiration?: string;
  // Penalty Settings
  shortcut_penalty?: string;
  wall_coll_penalty?: string;
  correct_vehicle_course?: string;
  car_coll_penalty?: string;
  pit_lane_line_cut_penalty?: string;
  ghosting_during_race?: string;
  flag_rules?: string;
  // Assist Settings
  countersteering_assist?: string;
  active_stability_manage?: string;
  driving_line_assist?: string;
  traction_control?: string;
  abs?: string;
  auto_drive?: string;
}

export type CreateEventAdvancedSettingsPayload = {
  eventId: string;
  revealAdvancedSettings?: boolean;
  // Time/Weather Settings
  weatherSelection?: string;
  presetWeather?: string;
  customWeather?: string;
  timeOfDay?: string;
  equalConMode?: string;
  variableTimeSpeedRate?: string;
  // Race Settings
  startType?: string;
  gridOrder?: string;
  bopTuningProhibited?: string;
  settingsOptions?: string;
  boost?: string;
  slipstreamStrength?: string;
  visibleDamage?: string;
  mechanicalDamage?: string;
  tireWearRate?: number;
  fuelConsumptionRate?: number;
  refuelingSpeed?: number;
  initialFuel?: number;
  gripReductionOffTrack?: string;
  raceFinishDelay?: number;
  minNumStops?: number;
  reqTireTypeChange?: string;
  nitroOvertakeUsage?: string;
  // Qualifier Settings
  timeLimit?: string;
  qualContinTime?: number;
  tireWearRtQual?: number;
  fuelConsumptionRtQual?: number;
  initialFuelQual?: number;
  slipstreamStrengthQual?: string;
  // Regulation Settings
  filterCategory?: string;
  ppLimit?: number;
  maxPowerOutput?: number;
  minWeight?: number;
  usableTires?: string;
  usableTiresTypes?: string;
  reqTireType?: string;
  nitrous?: string;
  kartUsage?: string;
  engineSwap?: string;
  tuningParts?: string;
  yearLowerLimit?: number;
  yearUpperLimit?: number;
  drivetrain?: string;
  aspiration?: string;
  // Penalty Settings
  shortcutPenalty?: string;
  wallCollPenalty?: string;
  correctVehicleCourse?: string;
  carCollPenalty?: string;
  pitLaneLineCutPenalty?: string;
  ghostingDuringRace?: string;
  flagRules?: string;
  // Assist Settings
  countersteeringAssist?: string;
  activeStabilityManage?: string;
  drivingLineAssist?: string;
  tractionControl?: string;
  abs?: string;
  autoDrive?: string;
}

// -- SUPABASE SERVICE TYPES -- //

type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

export type GetEventAdvancedSettingsResponse = {
  success: true;
  data: EventAdvancedSettingsTable;
} | SupabaseError;

export type CreateEventAdvancedSettingsResponse = {
  success: true;
  data: EventAdvancedSettingsTable;
} | SupabaseError;

export type UpdateEventAdvancedSettingsPayload = {
  eventId: string;
  revealAdvancedSettings?: boolean;
  // Time/Weather Settings
  weatherSelection?: string;
  presetWeather?: string;
  customWeather?: string;
  timeOfDay?: string;
  equalConMode?: string;
  variableTimeSpeedRate?: string;
  // Race Settings
  startType?: string;
  gridOrder?: string;
  bopTuningProhibited?: string;
  settingsOptions?: string;
  boost?: string;
  slipstreamStrength?: string;
  visibleDamage?: string;
  mechanicalDamage?: string;
  tireWearRate?: number;
  fuelConsumptionRate?: number;
  refuelingSpeed?: number;
  initialFuel?: number;
  gripReductionOffTrack?: string;
  raceFinishDelay?: number;
  minNumStops?: number;
  reqTireTypeChange?: string;
  nitroOvertakeUsage?: string;
  // Qualifier Settings
  timeLimit?: string;
  qualContinTime?: number;
  tireWearRtQual?: number;
  fuelConsumptionRtQual?: number;
  initialFuelQual?: number;
  slipstreamStrengthQual?: string;
  // Regulation Settings
  filterCategory?: string;
  ppLimit?: number;
  maxPowerOutput?: number;
  minWeight?: number;
  usableTires?: string;
  usableTiresTypes?: string;
  reqTireType?: string;
  nitrous?: string;
  kartUsage?: string;
  engineSwap?: string;
  tuningParts?: string;
  yearLowerLimit?: number;
  yearUpperLimit?: number;
  // Penalty Settings
  drivetrain?: string;
  aspiration?: string;
  shortcutPenalty?: string;
  wallCollPenalty?: string;
  correctVehicleCourse?: string;
  carCollPenalty?: string;
  pitLaneLineCutPenalty?: string;
  ghostingDuringRace?: string;
  flagRules?: string;
  // Assist Settings
  countersteeringAssist?: string;
  activeStabilityManage?: string;
  drivingLineAssist?: string;
  tractionControl?: string;
  abs?: string;
  autoDrive?: string;
}

export type UpdateEventAdvancedSettingsResponse = {
  success: true;
  data: EventAdvancedSettingsTable;
} | SupabaseError;

export type DeleteEventAdvancedSettingsPayload = {
  eventId: string;
}

export type DeleteEventAdvancedSettingsResponse = {
  success: true;
} | SupabaseError;
