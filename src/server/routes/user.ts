import { publicProcedure } from "../trpc";
import db from "../../db";
import { UserInfo, clientUserInfo } from "../../schema/userInfo";
import { webcrypto } from "crypto";
import * as vscode from "vscode";
import { listDir } from "../../fs/workspace";

export const getAllUsers = publicProcedure.query(async () => {
  return db.user.getAllData();
});

export const joinSession = publicProcedure
  .input(clientUserInfo)
  .mutation(async (opts) => {
    const uuid = webcrypto.randomUUID();
    const user: UserInfo = {
      ...opts.input,
      userId: uuid,
      lastLoginTime: new Date().toISOString(),
      role: "developer",
    };
    db.user.insert(user);
    const files = await listDir();
    return {
      success: true,
      files: files,
    };
  });
