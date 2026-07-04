export const TIME_LIMIT_OPTIONS = [
  { label: "1 minute", value: "1min" },
  { label: "2 minute(s)", value: "2min" },
  { label: "3 minute(s)", value: "3min" },
  { label: "5 minute(s)", value: "5min" },
  { label: "10 minute(s)", value: "10min" },
  { label: "15 minute(s)", value: "15min" },
  { label: "20 minute(s)", value: "20min" },
  { label: "25 minute(s)", value: "25min" },
  { label: "30 minute(s)", value: "30min" },
  { label: "40 minute(s)", value: "40min" },
  { label: "50 minute(s)", value: "50min" },
  { label: "60 minute(s)", value: "60min" },
  { label: "90 minute(s)", value: "90min" },
]

export const TIME_LIMIT_OPTIONS_DISPLAY = [
  { label: "1 minute", value: "1min" },
  { label: "2 minute(s)", value: "2min" },
  { label: "3 minute(s)", value: "3min" },
  { label: "5 minute(s)", value: "5min" },
  { label: "10 minute(s)", value: "10min" },
  { label: "15 minute(s)", value: "15min" },
  { label: "20 minute(s)", value: "20min" },
  { label: "25 minute(s)", value: "25min" },
  { label: "30 minute(s)", value: "30min" },
  { label: "40 minute(s)", value: "40min" },
  { label: "50 minute(s)", value: "50min" },
  { label: "60 minute(s)", value: "60min" },
  { label: "90 minute(s)", value: "90min" },
]


export const QUALIFYING_CONTINUE_TIME_MIN = 30;
export const QUALIFYING_CONTINUE_TIME_MAX = 180;
export const QUALIFYING_CONTINUE_TIME_STEP = 10;
export const QUALIFYING_CONTINUE_TIME_DEFAULT = 90;
export const QUALIFYING_CONTINUE_TIME_FORMATTER = (value: number) => `${value} second(s)`;

export const TIRE_WEAR_RT_QUAL_MIN = 0;
export const TIRE_WEAR_RT_QUAL_MAX = 50;
export const TIRE_WEAR_RT_QUAL_STEP = 1;
export const TIRE_WEAR_RT_QUAL_DEFAULT = 3;
export const TIRE_WEAR_RT_QUAL_FORMATTER = (value: number) =>
  value === 0 ? "Off" : `${value}x`;

export const FUEL_CONSUMPTION_RT_QUAL_MIN = 0;
export const FUEL_CONSUMPTION_RT_QUAL_MAX = 50;
export const FUEL_CONSUMPTION_RT_QUAL_STEP = 1;
export const FUEL_CONSUMPTION_RT_QUAL_DEFAULT = 3;
export const FUEL_CONSUMPTION_RT_QUAL_FORMATTER = (value: number) =>
  value === 0 ? "Off" : `${value}x`;


export const INITIAL_FUEL_QUAL_MIN = 0;
export const INITIAL_FUEL_QUAL_MAX = 100;
export const INITIAL_FUEL_QUAL_STEP = 1;
export const INITIAL_FUEL_QUAL_DEFAULT = 0;
export const INITIAL_FUEL_QUAL_FORMATTER = (value: number) =>
  value === 0 ? "Default" : `${value} liters`;

export const SLIPSTREAM_STRENGTH_QUAL_OPTIONS = [
  { label: "Strong", value: "strong" },
  { label: "Weak", value: "weak" },
  { label: "Real", value: "real" },
  { label: "Off", value: "off" },
];