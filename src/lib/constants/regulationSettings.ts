export const FILTER_BY_CATEGORY_OPTIONS = [
  { label: "No Limit", value: "noLimit" },
  { label: "Gr.1", value: "gr1" },
  { label: "Gr.2", value: "gr2" },
  { label: "Gr.3", value: "gr3" },
  { label: "Gr.4", value: "gr4" },
  { label: "Gr.B", value: "grb" },
];

export const PP_LIMIT_MIN = 100;
export const PP_LIMIT_MAX = 1000;
export const PP_LIMIT_STEP = 1;
export const PP_LIMIT_DEFAULT = 99;
export const PP_LIMIT_FORMATTER = (value: number) => {
  if (
    value < PP_LIMIT_MIN ||
    value > PP_LIMIT_MAX
  ) {
    return "No Limit";
  }

  return `${value}x`;
};

export const MAX_POWER_OUTPUT_MIN = 98;
export const MAX_POWER_OUTPUT_MAX = 1479;
export const MAX_POWER_OUTPUT_STEP = 1;
export const MAX_POWER_OUTPUT_DEFAULT = 97;
export const MAX_POWER_OUTPUT_FORMATTER = (value: number) => {
  if (
    value < MAX_POWER_OUTPUT_MIN ||
    value > MAX_POWER_OUTPUT_MAX
  ) {
    return "No Limit";
  }

  return `${value}x`;
};

export const MIN_WEIGHT_MIN = 1102;
export const MIN_WEIGHT_MAX = 4409;
export const MIN_WEIGHT_STEP = 1;
export const MIN_WEIGHT_DEFAULT = 1101;
export const MIN_WEIGHT_FORMATTER = (value: number) => {
  if (
    value < MIN_WEIGHT_MIN ||
    value > MIN_WEIGHT_MAX
  ) {
    return "No Limit";
  }
  return `${value}lb`;
};

export const USABLE_TIRE_OPTIONS = [
  { label: "No Limit", value: "noLimit" },
  { label: "Comfort", value: "comfort" },
  { label: "Sports", value: "sports" },
  { label: "Racing", value: "racing" },
];

export const USABLE_TIRE_WEAR_OPTIONS = [
  { label: "Hard", value: "hard" },
  { label: "Medium", value: "medium" },
  { label: "Soft", value: "soft" },
];

export const REQUIRED_TIRE_TYPE_OPTIONS = [
  { label: "Hard", value: "hard" },
  { label: "Medium", value: "medium" },
  { label: "Soft", value: "soft" },
]

export const NITROUS_OPTIONS = [
  { label: "Prohibited", value: "prohibited" },
  { label: "Required", value: "required" },
  { label: "Unrestricted", value: "unrestricted" },
];

export const KART_USAGE_OPTIONS = [
  { label: "Off", value: "false" },
  { label: "On", value: "true" },
];

export const ENGINE_SWAP_OPTIONS = [
  { label: "Prohibited", value: "prohibited" },
  { label: "Unrestricted", value: "unrestricted" },
];

export const TUNING_PARTS_OPTIONS = [
  { label: "Unrestricted", value: "unrestricted" },
  { label: "Extreme and Lower", value: "extremeAndLower" },
];

export const YEAR_LOWER_LIMIT_MIN = 1930;
export const YEAR_LOWER_LIMIT_MAX = 2035;
export const YEAR_LOWER_LIMIT_STEP = 1;
export const YEAR_LOWER_LIMIT_DEFAULT = 1929;
export const YEAR_LOWER_LIMIT_FORMATTER = (value: number) => {
  if (
    value < YEAR_LOWER_LIMIT_MIN ||
    value > YEAR_LOWER_LIMIT_MAX
  ) {
    return "No Limit";
  }
  return `${value}`;
};

export const YEAR_UPPER_LIMIT_MIN = 1929;
export const YEAR_UPPER_LIMIT_MAX = 2034;
export const YEAR_UPPER_LIMIT_STEP = 1;
export const YEAR_UPPER_LIMIT_DEFAULT = 2035;
export const YEAR_UPPER_LIMIT_FORMATTER = (value: number) => {
  if (
    value < YEAR_UPPER_LIMIT_MIN ||
    value > YEAR_UPPER_LIMIT_MAX
  ) {
    return "No Limit";
  }
  return `${value}`;
};

export const DRIVETRAIN_OPTIONS = [
  { label: "Unrestricted", value: "unrestricted" },
  { label: "FR", value: "fr" },
  { label: "FF", value: "ff" },
  { label: "4WD", value: "4wd" },
  { label: "MR", value: "mr" },
  { label: "RR", value: "rr" },
];

export const ASPIRATION_OPTIONS = [
  { label: "Unrestricted", value: "unrestricted" },
  { label: "Naturally Aspirated", value: "na" },
  { label: "Turbocharger", value: "tc" },
  { label: "Supercharger", value: "sc" },
  { label: "Turbocharger + Supercharger", value: "tc+sc" },
  { label: "Electric Vehicle", value: "ev" },
];