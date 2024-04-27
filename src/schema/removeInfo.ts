import { z } from "zod";

export const removeInfo = z.object({
  removeId: z.string().uuid(),     // 这次删除操作的 id
  time:     z.string().datetime(), // 这次删除操作的时间戳
  userId:   z.string().uuid(),     // 这次删除操作的操作者的 id
  name:     z.string(),            // 这次被删除的文件的名字
  path:     z.string(),            // 这次被删除的文件的路径
});

export type RemoveInfo = z.infer<typeof removeInfo>;
