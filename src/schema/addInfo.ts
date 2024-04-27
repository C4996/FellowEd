import { z } from "zod";

export const addInfo = z.object({
  addId:  z.string().uuid(),     // 这次添加操作的 id
  time:   z.string().datetime(), // 这次添加操作的时间戳
  userId: z.string().uuid(),     // 这次添加操作的操作者的 id
  name:   z.string(),            // 这次被添加的文件的名字
  path:   z.string(),            // 这次被添加的文件的路径
});

export type AddInfo = z.infer<typeof addInfo>;
