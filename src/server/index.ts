 import { UserInfo } from '../schema/userInfo';
import { publicProcedure, router } from './trpc';
import { fileQuery } from "../schema/fileInfo";

export const appRouter = router({
  getAllUsers: publicProcedure.query(async () => {
    return [
      { machineId: "1", name: "Alice", email: "haha@gmail.com" },
    ] as UserInfo[];
  }),
  getFileInfo: publicProcedure.input(fileQuery).query(async (opts) => {
    const { filePath } = opts.input;
    return {
      fileName: "file",
      filePath,
      fileSize: 100,
    };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
