import { formatInTimeZone } from "date-fns-tz";

// Formats a date string into a human-readable format for display in the schedule.
export const formatEventDate = (
  date: string,
  timeZone: string,
) => {
  // 1. Format using 'zzz' which yields standard abbreviations (e.g. "EDT", "EST", "PDT")
  const formatted = formatInTimeZone(
    date,
    timeZone,
    "EEE, dd MMM yyyy · h:mma zzz",
  );

  // 2. Convert 3-letter North American daylight/standard codes to generic codes (e.g. EDT -> ET)
  return formatted.replace(/\b([A-Z])[DS](T)\b/g, "$1$2");
};