import { z } from "zod";
import { userInfo } from "./userInfo";

export const fileInfo = z.object({
  //belongsTo: userInfo,
  name: z.string(),
  absolutePath: z.string(),
  content: z.string(),
});

export type FileInfo = z.infer<typeof fileInfo>;
