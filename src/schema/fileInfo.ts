import { z } from "zod";

// 文件名
// 文件路径
// 文件大小
export const fileInfo = z.object({
  fileName: z.string(),
  filePath: z.string(),
  fileSize: z.number(),
});

export const fileQuery = z.object({
  filePath: z.string(),
});

export type FileInfo = z.infer<typeof fileInfo>;
export type FileQuery = z.infer<typeof fileQuery>;
