import type { Level } from "@tiptap/extension-heading";

export const MAX_CHARACTERS = 2000;

export const HEADING_OPTIONS = [
  { value: "paragraph", label: "Normal" },
  { value: "h1", label: "Heading" },
  { value: "h2", label: "Subheading" },
] as const;

export type RichTextEditorFormValues = {
  heading: string;
};

export type RichTextEditorImageUploadResult =
  | string
  | {
      src: string;
      alt?: string;
    };

export const getHeadingLevel = (value: string): Level | null => {
  const headingLevels: Record<string, Level> = {
    h1: 1,
    h2: 2,
  };

  return headingLevels[value] ?? null;
};

export const readFileAsDataUrl = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read image file."));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Unable to read image file."));
    };

    reader.readAsDataURL(file);
  });
};
