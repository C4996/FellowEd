import { z } from "zod";
import  { type FileInfo, fileInfo } from "./fileInfo";

export const userInfo = z.object({
  machineId: z.string().uuid(), // 从 VSCode 获取的机器码
  userId: z.string().uuid(),
  name: z.string(), // 用户名称
  email: z.string().email().optional(), // 用户邮箱
  lastLoginTime: z.string().datetime(), // 上次登录时间
  privilege: z.enum(['maintainer', 'developer', 'visitor']).default('developer'), // 特权等级
  
});

export type UserInfo = z.infer<typeof userInfo>;
