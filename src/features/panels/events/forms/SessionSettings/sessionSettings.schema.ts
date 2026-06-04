import * as z from "zod";

export const sessionSettingsSchema = z
  .object({
    hasQualifying: z.boolean(),
    qualifyingType: z.enum(["laps", "time"]),
    qualifyingTime: z.string().optional(),
    qualifyingLaps: z.number().optional(),

    hasRace: z.boolean(),
    raceType: z.enum(["laps", "time"]),
    raceTime: z.string().optional(),
    raceLaps: z.number().optional(),

    revealSession: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.hasQualifying && !data.hasRace) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one session is required",
        path: ["hasQualifying"],
      });
    }

    if (data.hasQualifying) {
      if (
        data.qualifyingType === "laps" &&
        (!data.qualifyingLaps || data.qualifyingLaps < 1)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Qualifying laps required",
          path: ["qualifyingLaps"],
        });
      }

      if (
        data.qualifyingType === "time" &&
        !data.qualifyingTime
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Qualifying time required",
          path: ["qualifyingTime"],
        });
      }
    }

    if (data.hasRace) {
      if (
        data.raceType === "laps" &&
        (!data.raceLaps || data.raceLaps < 1)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Race laps required",
          path: ["raceLaps"],
        });
      }

      if (
        data.raceType === "time" &&
        !data.raceTime
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Race time required",
          path: ["raceTime"],
        });
      }
    }
  });

export type SessionSettingsFormValues = z.infer<typeof sessionSettingsSchema>;