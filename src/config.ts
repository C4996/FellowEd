import { UserInfo } from "./schema/userInfo";

export class UserConfig {
    private _serverIP: string = "";
    public get serverIP(): string {
        return this._serverIP;
    }
    public set serverIP(value: string) {
        this._serverIP = value;
    }
    private _serverPort: number = 0;
    public get serverPort(): number {
        return this._serverPort;
    }
    public set serverPort(value: number) {
        this._serverPort = value;
    }

    private _userInfo: UserInfo | undefined;
    public get userInfo(): UserInfo | undefined {
        return this._userInfo;
    }
    public set userInfo(value: UserInfo | undefined) {
        this._userInfo = value;
    }


    private static single: UserConfig;
    static getInstance() {
        if (!UserConfig.single) {
            UserConfig.single = new UserConfig();
        }
        return UserConfig.single;
    }
    private constructor() {}
}