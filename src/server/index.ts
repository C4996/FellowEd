import { UserInfo } from '../schema/userInfo';
import { publicProcedure, router } from './trpc';
import { fileQuery } from "../schema/fileInfo";
import { clientUserInfo } from '../schema/userInfo';
import { selectedContent,UserComment } from '../schema/userComment';
export const appRouter = router({
  tryConnect: publicProcedure.input(clientUserInfo).query(async (opts) => {
    const user = opts.input;
    console.log(user);
  }),
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
  getFileComments: publicProcedure.input(fileQuery).query(async (opts) => {
      const {filePath} = opts.input;
      return [
          {
              userId: "1",
              comment: "hello",
              fileId: "1",
              selected: {
                  fileId: "1",
                  offset: 0,
                  length: 10,
                  userId: "1"
              },
              createdAt: "2021-03-01T00:00:00.000Z"
          }
      ] as UserComment[];
  }),
  addComment: publicProcedure.input(selectedContent).mutation(async (opts) => {
      const {fileId,offset,length,userId} = opts.input;
      return {
          userId,
          comment: "hello",
          fileId,
          selected: {
              fileId,
              offset,
              length,
              userId
          },
          createdAt: "2021-03-01T00:00:00.000Z"
      } as UserComment;
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
