import { z } from "zod";

export const userInfo = z.object({
  machineId: z.string(), // 从 VSCode 获取的机器码
  userId: z.string().uuid(),
  name: z.string(), // 用户名称
  email: z.string().email().optional(), // 用户邮箱
  lastLoginTime: z.string().datetime(), // 上次登录时间
  role: z.enum(['maintainer', 'developer', 'visitor']).default('developer'), // 权限等级
});

export const clientUserInfo = userInfo.pick({
  machineId: true,
  name: true,
  email: true,
});

export type ClientUserInfo = z.infer<typeof clientUserInfo>;
export type UserInfo = z.infer<typeof userInfo>;
