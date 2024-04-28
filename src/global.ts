import { newTRPC } from "./client";

export type TRPCClient = ReturnType<typeof newTRPC>["trpc"];

export class Config {
    public trpc: TRPCClient | undefined;

    private constructor() {}
    private static single: Config = undefined;
    public static getInstance() {
        if (!Config.single) {
            Config.single = new Config;
        }
        return Config.single;
    }
}