import { supabase } from "@/lib/supabase";
import type { CreateEventAdvancedSettingsPayload, CreateEventAdvancedSettingsResponse, DeleteEventAdvancedSettingsResponse, GetEventAdvancedSettingsResponse, UpdateEventAdvancedSettingsPayload, UpdateEventAdvancedSettingsResponse } from "@/types/eventAdvancedSettings";

const buildAdvancedSettingsData = (
  payload: CreateEventAdvancedSettingsPayload,
) => ({
  event_id: payload.eventId,
  reveal_advanced_settings: payload.revealAdvancedSettings,
  weather_selection: payload.weatherSelection,
  preset_weather: payload.presetWeather,
  custom_weather: payload.customWeather,
  time_of_day: payload.timeOfDay,
  equal_con_mode: payload.equalConMode,
  variable_time_speed_rate: payload.variableTimeSpeedRate,
  start_type: payload.startType,
  grid_order: payload.gridOrder,
  bop_tuning_prohibited: payload.bopTuningProhibited,
  settings_options: payload.settingsOptions,
  boost: payload.boost,
  slipstream_strength: payload.slipstreamStrength,
  visible_damage: payload.visibleDamage,
  mechanical_damage: payload.mechanicalDamage,
  tire_wear_rate: payload.tireWearRate,
  fuel_consumption_rate: payload.fuelConsumptionRate,
  refueling_speed: payload.refuelingSpeed,
  initial_fuel: payload.initialFuel,
  grip_reduction_off_track: payload.gripReductionOffTrack,
  race_finish_delay: payload.raceFinishDelay,
  min_num_stops: payload.minNumStops,
  req_tire_type_change: payload.reqTireTypeChange,
  nitro_overtake_usage: payload.nitroOvertakeUsage,
  time_limit: payload.timeLimit,
  qual_contin_time: payload.qualContinTime,
  tire_wear_rt_qual: payload.tireWearRtQual,
  fuel_consumption_rt_qual: payload.fuelConsumptionRtQual,
  initial_fuel_qual: payload.initialFuelQual,
  slipstream_strength_qual: payload.slipstreamStrengthQual,
  filter_category: payload.filterCategory,
  pp_limit: payload.ppLimit,
  max_power_output: payload.maxPowerOutput,
  min_weight: payload.minWeight,
  usable_tires: payload.usableTires,
  usable_tires_types: payload.usableTiresTypes,
  req_tire_type: payload.reqTireType,
  nitrous: payload.nitrous,
  kart_usage: payload.kartUsage,
  engine_swap: payload.engineSwap,
  tuning_parts: payload.tuningParts,
  year_lower_limit: payload.yearLowerLimit,
  year_upper_limit: payload.yearUpperLimit,
  drivetrain: payload.drivetrain,
  aspiration: payload.aspiration,
  shortcut_penalty: payload.shortcutPenalty,
  wall_coll_penalty: payload.wallCollPenalty,
  correct_vehicle_course: payload.correctVehicleCourse,
  car_coll_penalty: payload.carCollPenalty,
  pit_lane_line_cut_penalty: payload.pitLaneLineCutPenalty,
  ghosting_during_race: payload.ghostingDuringRace,
  flag_rules: payload.flagRules,
  countersteering_assist: payload.countersteeringAssist,
  active_stability_manage: payload.activeStabilityManage,
  driving_line_assist: payload.drivingLineAssist,
  traction_control: payload.tractionControl,
  abs: payload.abs,
  auto_drive: payload.autoDrive,
});

export const getEventAdvancedSettings = async (eventId: string): Promise<GetEventAdvancedSettingsResponse> => {
    const { data, error } = await supabase
    .from("event_advanced_settings")
    .select("*")
    .eq("event_id", eventId)
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

export const createEventAdvancedSettings = async (payload: CreateEventAdvancedSettingsPayload): Promise<CreateEventAdvancedSettingsResponse> => {
  const { data, error } = await supabase    .from("event_advanced_settings")
    .insert(buildAdvancedSettingsData(payload))
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

export const updateEventAdvancedSettings = async (
  payload: UpdateEventAdvancedSettingsPayload,
): Promise<UpdateEventAdvancedSettingsResponse> => {
  const { data, error } = await supabase
    .from("event_advanced_settings")
    .update(buildAdvancedSettingsData(payload))
    .eq("event_id", payload.eventId)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data,
  };
};

export const deleteEventAdvancedSettings = async (eventId: string): Promise<DeleteEventAdvancedSettingsResponse> => {
  const { error } = await supabase
    .from("event_advanced_settings")
    .delete()
    .eq("event_id", eventId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return { success: true };
}

export const deleteEventAdvancedSettingsByEventIds = async (eventIds: string[]): Promise<DeleteEventAdvancedSettingsResponse> => {
  if (eventIds.length === 0) {
    return { success: true };
  }

  const { error } = await supabase
    .from("event_advanced_settings")
    .delete()
    .in("event_id", eventIds);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return { success: true };
};