import { z } from "zod";
import { userInfo } from "./userInfo";
import { fileInfo, type FileInfo}   from "./fileInfo";
export const workspaceInfoSchema = z.object({
  belongsTo: userInfo,
  name: z.string(),
  absolutePath: z.string(),
  files: z.array(fileInfo),
});

export type WorkspaceInfo = z.infer<typeof workspaceInfoSchema>;
