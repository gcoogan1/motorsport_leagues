export const START_TYPE_OPTIONS = [
  { label: "Grid Start", value: "gridStart" },
  { label: "Grid Start with FSC", value: "gridStartWithFsc" },
  { label: "Rolling Start", value: "rollingStart" },
];

export const GRID_ORDER_OPTIONS = [
  { label: "Fastest First", value: "fastestFirst" },
  { label: "Slowest First", value: "slowestFirst" },
  { label: "Set by Host", value: "setByHost" },
];

export const BOP_TUNING_OPTIONS = [
  { label: "Off", value: "false" },
  { label: "On", value: "true" },
];


export const SETTINGS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Some", value: "some" },
  { label: "Brake Balance Only", value: "brakeBalanceOnly" },
  { label: "None", value: "none" },
];

export const BOOST_OPTIONS = [
  { label: "Strong", value: "strong" },
  { label: "Weak", value: "weak" },
  { label: "None", value: "none" },
];

export const SLIPSTREAM_STRENGTH_OPTIONS = [
  { label: "Strong", value: "strong" },
  { label: "Weak", value: "weak" },
  { label: "Real", value: "real" },
  { label: "Off", value: "off" },
];

export const VISIBLE_DAMAGE_OPTIONS = [
  { label: "Off", value: "false" },
  { label: "On", value: "true" },
];

export const MECHANICAL_DAMAGE_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Light", value: "light" },
  { label: "Heavy", value: "heavy" },
];

export const TIRE_WEAR_RATE_MIN = 0;
export const TIRE_WEAR_RATE_MAX = 50;
export const TIRE_WEAR_RATE_STEP = 1;
export const TIRE_WEAR_RATE_DEFAULT = 3;
export const TIRE_WEAR_RATE_FORMATTER = (value: number) =>
  value === 0 ? "Off" : `${value}x`;

export const FUEL_CONSUMPTION_RATE_MIN = 0;
export const FUEL_CONSUMPTION_RATE_MAX = 50;
export const FUEL_CONSUMPTION_RATE_STEP = 1;
export const FUEL_CONSUMPTION_RATE_DEFAULT = 3;
export const FUEL_CONSUMPTION_RATE_FORMATTER = (value: number) =>
  value === 0 ? "Off" : `${value}x`;

export const REFUELING_SPEED_MIN = 1;
export const REFUELING_SPEED_MAX =20;
export const REFUELING_SPEED_STEP = 1;
export const REFUELING_SPEED_DEFAULT = 3;
export const REFUELING_SPEED_FORMATTER = (value: number) => `${value} L/sec`;

export const INITIAL_FUEL_MIN = 0;
export const INITIAL_FUEL_MAX = 100;
export const INITIAL_FUEL_STEP = 1;
export const INITIAL_FUEL_DEFAULT = 101;
export const INITIAL_FUEL_FORMATTER = (value: number) =>
  value < INITIAL_FUEL_MIN || value > INITIAL_FUEL_MAX
    ? "Default"
    : `${value} liters`;

export const GRIP_REDUCTION_OFF_TRACK_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Real", value: "real" },
];

export const FINISH_DELAY_MIN = 30;
export const FINISH_DELAY_MAX = 180;
export const FINISH_DELAY_STEP = 10;
export const FINISH_DELAY_DEFAULT = 90;
export const FINISH_DELAY_FORMATTER = (value: number) => `${value} second[s]`;

export const MIN_NUM_STOPS_MIN = 0;
export const MIN_NUM_STOPS_MAX = 2;
export const MIN_NUM_STOPS_STEP = 1;
export const MIN_NUM_STOPS_DEFAULT = 0;

export const REQ_TIRE_TYPE_CHANGE_OPTIONS = [
  { label: "Off", value: "false" },
  { label: "On", value: "true" },
];

export const NITRO_OVERTAKE_USAGE_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Custom", value: "custom" },
];