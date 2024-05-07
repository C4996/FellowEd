import { publicProcedure, router } from "./trpc";
import { fileQuery } from "../schema/fileInfo";
import { selectedContent, UserComment } from "../schema/userComment";
import { getAllUsers, joinSession } from "./routes/user";
import { tryConnect } from "./routes/connect";
import * as vscode from 'vscode';

export const appRouter = router({
  tryConnect,
  getAllUsers,
  joinSession,
  getFileInfo: publicProcedure.input(fileQuery).query(async (opts) => {
    const { filePath } = opts.input;
    return {
      fileName: "file",
      filePath,
      fileSize: 100,
    };
  }),
  getFileComments: publicProcedure.input(fileQuery).query(async (opts) => {
    const { filePath } = opts.input;
    return [
      {
        userId: "1",
        comment: "hello",
        fileId: "1",
        selected: {
          fileId: "1",
          offset: 0,
          length: 10,
          userId: "1",
        },
        createdAt: "2021-03-01T00:00:00.000Z",
      },
    ] as UserComment[];
  }),
  addComment: publicProcedure.input(selectedContent).mutation(async (opts) => {
    const { fileId, offset, length, userId } = opts.input;
    return {
      userId,
      comment: "hello",
      fileId,
      selected: {
        fileId,
        offset,
        length,
        userId,
      },
      createdAt: "2021-03-01T00:00:00.000Z",
    } as UserComment;
  }),
  getFileContent: publicProcedure.input(fileQuery).query(async (opts) => {
    const { filePath } = opts.input;

    return {
      fileName: 'Test',
      content: 'Hello World'
    };
  }),
  getCurrentFile: publicProcedure.query(async (opts) => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      return {
        status: 'Ok',
        fileName: editor.document.fileName,
        content: editor.document.getText(),
      };
    } else {
      return {
        status: 'Error: No opened file!',
        fileName: '',
        content: '',
      };
    }
  })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
