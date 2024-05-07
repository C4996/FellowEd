import type { UserInfo } from "../schema/userInfo.js";
import * as vscode from "vscode";

async function getUserInfoHandler(): Promise<UserInfo> {
  return {
    machineId: vscode.env.machineId,
    lastLoginTime: new Date().toISOString(),
    userId: "1",
    role: "maintainer",
    name: "User",
    email: "example@example.com",
  };
}

export default getUserInfoHandler;
