import * as z from "zod";

const CarCategory = {
  STOCK: "stock",
  GR_N: "gr.n",
  GR_4: "gr.4",
  GR_3: "gr.3",
  GR_2: "gr.2",
  GR_1: "gr.1",
  GR_B: "gr.b",
  GR_X: "gr.x",
} as const;

export const trackCarDetailsSchema = z.object({
  trackName: z
    .string()
    .min(1, "Please select a track."),

  carSelection: z.enum(["Specified", "Category", "Assigned"]),
  cars: z.array(z.object({
    category: z.enum(Object.values(CarCategory)),
    model: z.string(),
  })).optional(),
  carCategory: z.enum(Object.values(CarCategory)).optional(),
  revealTrack: z.boolean().optional(),
  revealCarDetails: z.boolean().optional(),
});

export type TrackCarDetailsFormValues =
  z.infer<typeof trackCarDetailsSchema>;