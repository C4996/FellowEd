import { newTRPC } from "./client";

export class Config {
    private _trpc: ReturnType<typeof newTRPC>["trpc"] | undefined;
    public get trpc(): ReturnType<typeof newTRPC>["trpc"] | undefined {
        return this._trpc;
    }
    public set trpc(value: ReturnType<typeof newTRPC>["trpc"] | undefined) {
        this._trpc = value;
    }

    private constructor() {}
    private static single: Config = undefined;
    public static getInstance() {
        if (!Config.single) {
            Config.single = new Config;
        }
        return Config.single;
    }
}