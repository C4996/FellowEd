import { publicProcedure } from "../trpc.js";
import db from "../../db/index.js";
import { UserInfo, clientUserInfo } from "../../schema/userInfo.js";
import { webcrypto } from "crypto";
import * as vscode from "vscode";

export const getAllUsers = publicProcedure.query(async () => {
  return db.user.getAllData();
});

export const joinSession = publicProcedure.input(clientUserInfo).mutation(async (opts) => {
  const uuid = webcrypto.randomUUID();
  const user: UserInfo = {
    ...opts.input,
    userId: uuid,
    lastLoginTime: new Date().toISOString(),
    role: "developer",
  };
  db.user.insert(user);
  
  return {
    success: true,
    fileOpened: [vscode.window.activeTextEditor?.document.fileName],
  };
});
