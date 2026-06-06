export const WEATHER_SELECTION_OPTIONS = [
  { label: "Preset Weather", value: "presetWeatherSelection" },
  { label: "Custom Weather", value: "customWeatherSelection" },
];

export const PRESET_WEATHER_OPTIONS = [
  { label: "S01 Dry, Cloudless and Pleasant", value: "s01" },
  { label: "S02 Dry and Pleasant with a Few Clouds", value: "s02" },
  { label: "S03 Dry, Cloudy and Pleasant", value: "s03" },
  { label: "S04 Dry, Cloudy and Sunny", value: "s04" },
  { label: "S05 Misty, Cloudless and Sunny", value: "s05" },
  { label: "S06 Humid, Cloudless and Pleasant", value: "s06" },
  { label: "S07 Humid and Pleasant with a Few Clouds", value: "s07" },
  { label: "S08 Humid, Sunny and Cloudy", value: "s08" },
  { label: "S09 Humid and Sunny with Lots of Clouds", value: "s09" },
  { label: "S10 Misty and Sunny with Lots of Clouds", value: "s10" },
  { label: "S11 Sunny with Alpine Mist", value: "s11" },
  { label: "S12 Sunny with Lots of Monsoon Clouds", value: "s12" },
  { label: "S13 Sunny with a Few Monsoon Clouds", value: "s13" },
  { label: "S14 Sunny with Lots of Monsoon Clouds", value: "s14" },
  { label: "S15 Hazy, Cloudless and Pleasant", value: "s15" },
  { label: "S16 Hazy and Sunny with a Few Clouds", value: "s16" },
  { label: "S17 Hazy, Cloudy and Sunny", value: "s17" },
  { label: "S18 Hazy, Cloudy and Sunny", value: "s18" },
  { label: "C01 Cloudy and Bright", value: "c01" },
  { label: "C02 Cloudy and Warm", value: "c02" },
  { label: "C03 Cloudy and Dark", value: "c03" },
  { label: "C04 Cloudy and Chilly", value: "c04" },
  { label: "C05 Cloudy", value: "c05" },
  { label: "C06 Thick Clouds", value: "c06" },
  { label: "R01 Light Drizzle", value: "r01" },
  { label: "R02 Cloudless with Warm Rain", value: "r02" },
  { label: "R03 Light Rain", value: "r03" },
  { label: "R04 Cloudy with Rain", value: "r04" },
  { label: "R05 Cloudy with Rain", value: "r05" },
  { label: "R06 Thick Cloud with Rain", value: "r06" },
  { label: "R07 Cloudy with Torrential Rain", value: "r07" },
  { label: "R08 Thick Cloud with Torrential Rain", value: "r08" },
];

export const TIME_OF_DAY_OPTIONS = [
  { label: "Early Dawn", value: "earlyDawn" },
  { label: "Dawn", value: "dawn" },
  { label: "Sunrise", value: "sunrise" },
  { label: "Early Morning", value: "earlyMorning" },
  { label: "Late Morning", value: "lateMorning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
  { label: "Sunset", value: "sunset" },
  { label: "Twilight", value: "twilight" },
  { label: "Night", value: "night" },
  { label: "Midnight", value: "midnight" },
];

export const EQUAL_CONDITION_OPTIONS = [
  { label: "Off", value: "false" },
  { label: "On", value: "true" },
];

export const VARIABLE_TIME_SPEED_RATE_MIN = 0;
export const VARIABLE_TIME_SPEED_RATE_MAX = 30;
export const VARIABLE_TIME_SPEED_RATE_STEP = 1;
export const VARIABLE_TIME_SPEED_RATE_DEFAULT = 1;
export const VARIABLE_TIME_SPEED_RATE_FORMATTER = (value: number) => `${value}x`;