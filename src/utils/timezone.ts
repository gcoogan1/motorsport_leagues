import type { SelectInputOption } from "@/components/Inputs/SelectInput/SelectInput";

// This file provides utility functions for handling timezones, including formatting timezone labels and generating a list of timezone options for select inputs.
const intlWithSupportedValues = Intl as typeof Intl & {
  supportedValuesOf?: (key: string) => string[];
};

// Regular expression patterns for matching UTC and GMT offset timezones
const UTC_OFFSET_PATTERN = /^UTC([+-])(\d{2}):(\d{2})$/;
const GMT_OFFSET_PATTERN = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/;

// Checks if a given timezone string is in the format of a UTC offset (e.g., "UTC+02:00")
const isUtcOffsetValue = (timezone: string): boolean => {
  return UTC_OFFSET_PATTERN.test(timezone);
};

// Converts a timezone string to its corresponding UTC offset in the format "UTC±HH:MM"
const getRawTimezoneOffset = (timezone: string): string | undefined => {
  if (isUtcOffsetValue(timezone)) {
    return timezone.replace(/^UTC/, "GMT");
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value;
};

// Retrieves the user's current timezone using the Intl API, with a fallback to "UTC" if it cannot be determined
export const getCurrentTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
};

// Converts a timezone string to a standardized UTC offset format for display purposes
export const getTimezoneUtcOffset = (timezone: string): string => {
  if (isUtcOffsetValue(timezone)) {
    return timezone;
  }

  const rawOffset = getRawTimezoneOffset(timezone);

  if (!rawOffset || rawOffset === "GMT") {
    return "UTC+00:00";
  }

  const match = rawOffset.match(GMT_OFFSET_PATTERN);

  if (!match) {
    return rawOffset.replace(/^GMT/, "UTC");
  }

  const [, sign, hours, minutes] = match;

  return `UTC${sign}${hours.padStart(2, "0")}:${(minutes ?? "00").padStart(2, "0")}`;
};

// Formats a timezone string into a more user-friendly label, including the UTC offset and city name (e.g., "America/New_York" becomes "(UTC-05:00) New York")
export const formatTimezoneLabel = (timezone: string): string => {
  if (isUtcOffsetValue(timezone)) {
    return timezone;
  }

  const timezoneParts = timezone.split("/");
  const city = timezoneParts[timezoneParts.length - 1]?.replaceAll("_", " ") ?? timezone;

  return `(${getTimezoneUtcOffset(timezone)}) ${city}`;
};

// Generates a list of timezone options for use in select inputs, including the current league timezone if it's not already in the list of supported timezones
export const getTimezoneOptions = (): SelectInputOption[] => {
  const timezones = intlWithSupportedValues.supportedValuesOf?.("timeZone") ?? [getCurrentTimezone()];

  return timezones
    .map((timezone) => ({
      value: timezone,
      label: formatTimezoneLabel(timezone),
      secondaryInfo: timezone,
    }))
    // Sort by the label (City name) so "New York" isn't buried under "America"
    .sort((a, b) => a.label.localeCompare(b.label));
};
