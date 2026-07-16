import { formatInTimeZone, fromZonedTime, getTimezoneOffset } from "date-fns-tz";
import { enUS } from "date-fns/locale";

// Formats a date string into a human-readable format for display in the schedule.
export const formatEventDate = (
  date?: string,
  timeZone?: string,
) => {
  if (!date || !timeZone) return "";
  // 1. Format using 'zzz' which yields standard abbreviations (e.g. "EDT", "EST", "PDT")
  const formatted = formatInTimeZone(
    date,
    timeZone,
    "EEE, dd MMM yyyy · h:mma zzz",
  );

  // 2. Convert 3-letter North American daylight/standard codes to generic codes (e.g. EDT -> ET)
  return formatted.replace(/\b([A-Z])[DS](T)\b/g, "$1$2");
};

export const combineEventDateAndTime = (
  date: Date,
  time: string,
  timeZone: string,
) => {
  const [hours, minutes] = time.split(":").map(Number);

  const localDateTime = new Date(date);

  localDateTime.setHours(hours);
  localDateTime.setMinutes(minutes);
  localDateTime.setSeconds(0);
  localDateTime.setMilliseconds(0);

  return fromZonedTime(localDateTime, timeZone).toISOString();
};

export const getTimeFromDate = (date?: string, timeZone?: string) => {
  if (!date || !timeZone) return "";
  return formatInTimeZone(date, timeZone, "HH:mm");
};

export const formatTimeAgo = (createdAt?: string) => {
  if (!createdAt) return "";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "";

  const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);

  const mins = Math.floor(secondsAgo / 60);
  const hours = Math.floor(secondsAgo / 3600);

  if (secondsAgo < 60) return "A few seconds ago";
  if (secondsAgo < 3600) return `${mins} ${mins === 1 ? "min" : "mins"} ago`;
  if (secondsAgo < 43200) return `${hours} ${hours === 1 ? "hr" : "hrs"} ago`;

  return date.toLocaleDateString();
};

// Returns a timezone label for display purposes, based on the provided date and timezone.
// For US timezones, it returns the standard abbreviation (e.g., "ET" for Eastern Time).
// For non-US timezones, it returns the GMT offset (e.g., "GMT+2").
const getTimezoneLabel = (date: string, timeZone: string) => {
  const isUS = timeZone.startsWith("America/");

  if (isUS) {
    const abbreviation = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short",
    })
      .formatToParts(new Date(date))
      .find((part) => part.type === "timeZoneName")
      ?.value;

    if (abbreviation && /^[EPCM][DS]T$/.test(abbreviation)) {
      return abbreviation[0] + abbreviation[2];
    }

    return abbreviation ?? timeZone;
  }

  // Outside US: return GMT offset
  const offset = getTimezoneOffset(timeZone, new Date(date));

  const hours = offset / 3600000;

  if (hours === 0) return "GMT";

  return `GMT${hours > 0 ? "+" : ""}${hours}`;
};

// Formats a date string into a human-readable format for display in the user's schedule.
export const formatEventDateUserSchedule = (
  date?: string,
  timeZone?: string,
) => {
  if (!date || !timeZone) return "";

  const formatted = formatInTimeZone(
    date,
    timeZone,
    "EEE, dd MMM yyyy · h:mma",
    { locale: enUS }
  );

  return `${formatted} ${getTimezoneLabel(date, timeZone)}`;
};