import { z } from "zod";
import { MAX_CHARACTERS } from "@/components/Inputs/RichTextEditor/RichTextEditor.util";

const stripHtml = (value: string): string => {
  if (!value) {
    return "";
  }

  if (typeof DOMParser !== "undefined") {
    const document = new DOMParser().parseFromString(value, "text/html");
    return document.body.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
  }

  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const hasImageContent = (value: string): boolean => {
  if (!value) {
    return false;
  }

  if (typeof DOMParser !== "undefined") {
    const document = new DOMParser().parseFromString(value, "text/html");
    return document.querySelector("img") !== null;
  }

  return /<img\b[^>]*>/i.test(value);
};

export const briefingPanelSchema = z.object({
  briefing: z
    .string()
    .superRefine((value, context) => {
      const plainText = stripHtml(value);
      const containsImage = hasImageContent(value);

      if (!plainText && !containsImage) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Driver briefing cannot be empty.",
        });
        return;
      }

      if (plainText.length > MAX_CHARACTERS) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Briefing cannot be longer than ${MAX_CHARACTERS.toLocaleString()} characters.`,
        });
      }
    }),
});

export type BriefingPanelSchema = z.infer<typeof briefingPanelSchema>;
