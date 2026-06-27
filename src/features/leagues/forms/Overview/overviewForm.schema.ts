import z from "zod";

export const overviewFormSchema = z.object({
  poster: z
    .object({
      type: z.literal("upload"),
      file: z.instanceof(File).optional(),
      previewUrl: z.string().optional(),
    })
    .optional(),
  contentBlocks: z.array(
    z.object({
      id: z.string().optional(),
      image: z
        .object({
          type: z.literal("upload"),
          file: z.instanceof(File).optional(),
          previewUrl: z.string().optional(),
        })
        .optional(),
      title: z
        .string()
        .min(1, "Header is required.")
        .max(80, "Header must be 80 characters or fewer."),
      description: z
        .string()
        .min(1, "Body is required.")
        .max(360, "Text area must be 360 characters or fewer."),
    }),
  ),
  championshipPoints: z.array(
    z.object({
      id: z.string().optional(),
      points: z.string(),
    }),
  ),
});

export type OverviewFormValues = z.infer<typeof overviewFormSchema>;