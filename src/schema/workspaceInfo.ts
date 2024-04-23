import { z } from "zod";
import { userInfo } from "./userInfo";

export const workspaceInfoSchema = z.object({
  belongsTo: userInfo,
  name: z.string(),
  absolutePath: z.string(),
  files: z.array(z.string()),
});

export type WorkspaceInfo = z.infer<typeof workspaceInfoSchema>;
