import { newTRPC } from "./client";
import * as vscode from "vscode";

export type TRPCClient = ReturnType<typeof newTRPC>["trpc"];

export class Config {
    public trpc: TRPCClient | undefined;
    public statusBarItem: vscode.StatusBarItem | undefined;

    private constructor() {}
    private static single: Config = undefined;
    public static getInstance() {
        if (!Config.single) {
            Config.single = new Config;
        }
        return Config.single;
    }
}