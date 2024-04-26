import { z } from "zod";

export const userInfo = z.object({
  machineId: z.string().uuid(),
  name: z.string(),
  email: z.string().email().optional(),
  priority: z.enum(['maintainer', 'developer', 'visitor']),
});

export type UserInfo = z.infer<typeof userInfo>;
