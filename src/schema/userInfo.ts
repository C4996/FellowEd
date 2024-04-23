import { z } from "zod";

export const userInfo = z.object({
  machineId: z.string().uuid(),
  name: z.string(),
  email: z.string().email().optional(),
});

export type UserInfo = z.infer<typeof userInfo>;
