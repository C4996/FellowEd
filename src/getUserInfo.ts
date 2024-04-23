import type { UserInfo } from "./schema/userInfo";
import * as vscode from "vscode";

async function getUserInfoHandler(): Promise<UserInfo> {
  return {
    machineId: vscode.env.machineId,
    name: "User",
    email: "example@example.com",
  };
}

export default getUserInfoHandler;
