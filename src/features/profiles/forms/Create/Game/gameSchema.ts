import { GAME_TYPES } from "@/types/profile.types";
import { z } from "zod";


export const gameSchema = z.object({
  game: z.enum(GAME_TYPES),
});

export type GameValues = z.infer<typeof gameSchema>;
