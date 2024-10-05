import { z } from "zod"

export const fishSchema = z.object({
  fishId: z.string(),
  image: z.string(),
  fishName: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string()
})

export type FishType = z.infer<typeof fishSchema>
