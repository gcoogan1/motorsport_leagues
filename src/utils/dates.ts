import { formatInTimeZone } from "date-fns-tz";

// Formats a date string into a human-readable format for display in the schedule.
export const formatEventDate = (
  date: string,
) => {
  return formatInTimeZone(
    date,
    "America/New_York",
    "EEE, dd MMM yyyy · h:mma zzz",
  );
};