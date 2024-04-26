import { UserInfo, userInfo } from "../schema/userInfo";

// global config for server
export class ServerConfig {

    private _serverPort: number = 0;
    public get serverPort(): number {
        return this._serverPort;
    }
    public set serverPort(value: number) {
        this._serverPort = value;
    }

    private static single: ServerConfig;
    static getInstance() {
        if (!ServerConfig.single) {
            ServerConfig.single = new ServerConfig();
        }
        return ServerConfig.single;
    }
    private constructor() { }
}
