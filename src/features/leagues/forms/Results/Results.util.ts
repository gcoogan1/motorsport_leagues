import type { SessionType } from "@/types/results.types";

export type ResultFormRow = {
  resultId?: string;
  driverId: string;
  time: string;
  points: string;
};

export type ResultsFormValues = {
  results: ResultFormRow[];
  fastestLap: ResultFormRow[];
};

export const SESSION_TYPE_LABEL: Record<SessionType, string> = {
  qualifying: "Qualifying Session",
  race: "Race Session",
};

export const RESULT_TABLE_STYLE = {
  width: "min(100%, 640px)",
  marginInline: "auto",
} as const;