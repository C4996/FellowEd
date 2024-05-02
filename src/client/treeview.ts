import * as vscode from 'vscode';
import { UserInfo } from '../schema/userInfo';
import assert from 'assert';

export enum UserStatus {
    Online = 'online',
    Offline = 'offline'
}

class User {
    public name: string;
    public uuid: string;
    public status: UserStatus;
    public privilege: string;
    constructor(userInfo: UserInfo, status: UserStatus) {
        this.name = userInfo.name!;
        this.uuid = userInfo.userId!;
        this.status = status;
        this.privilege = userInfo.privilege!;
    }
}

class UserGroup {
    constructor(public status: UserStatus, public users: User[]) {}
}

class UserTreeDataProvider implements vscode.TreeDataProvider<User | UserGroup> {
    private _onDidChangeTreeData: vscode.EventEmitter<User | UserGroup | undefined | null | void> = new vscode.EventEmitter<User | UserGroup | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<User | UserGroup | undefined | null | void> = this._onDidChangeTreeData.event;

    public users: User[] = [];
    public userGroups: UserGroup[] = [];

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getChildren(element?: User | UserGroup): Thenable<(User | UserGroup)[]> {
        if (!element) {
            return Promise.resolve(this.userGroups);
        } else if (element instanceof UserGroup) {
            return Promise.resolve(element.users);
        } else {
            return Promise.resolve([]);
        }
    }

    getTreeItem(element: User | UserGroup): vscode.TreeItem {
        if (element instanceof UserGroup) {
            const treeItem = new vscode.TreeItem(element.status === UserStatus.Online ? 'Online' : 'Offline', vscode.TreeItemCollapsibleState.Collapsed);
            treeItem.contextValue = 'userGroup';
            return treeItem;
        } else {
            const treeItem = new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.None);
            treeItem.iconPath = new vscode.ThemeIcon(element.status === UserStatus.Online ? 'circle-filled' : 'circle-outline');
            treeItem.description = element.privilege;
            return treeItem;
        }
    }
}

let userTreeDataProvider: UserTreeDataProvider;

export function userListActivate(context: vscode.ExtensionContext) {
    userTreeDataProvider = new UserTreeDataProvider();
    vscode.window.registerTreeDataProvider('userList', userTreeDataProvider);

    context.subscriptions.push(vscode.commands.registerCommand('userList.refresh', () => {
        userTreeDataProvider.refresh();
    }));


    // examples:
    addUsers(
        [
          {
            machineId: vscode.env.machineId,
            lastLoginTime: new Date().toISOString(),
            userId: "1",
            privilege: "maintainer",
            name: "AAAA",
            email: "example@example.com",
          },
          {
            machineId: vscode.env.machineId,
            lastLoginTime: new Date().toISOString(),
            userId: "2",
            privilege: "developer",
            name: "BBBB",
            email: "example@example.com",
          },
          {
            machineId: vscode.env.machineId,
            lastLoginTime: new Date().toISOString(),
            userId: "3",
            privilege: "maintainer",
            name: "CCCC",
            email: "example@example.com",
          },
          {
            machineId: vscode.env.machineId,
            lastLoginTime: new Date().toISOString(),
            userId: "4",
            privilege: "developer",
            name: "DDDD",
            email: "example@example.com",
          },
          {
            machineId: vscode.env.machineId,
            lastLoginTime: new Date().toISOString(),
            userId: "5",
            privilege: "visitor",
            name: "EEEE",
            email: "example@example.com",
          }
        ],
        [
          UserStatus.Online,
          UserStatus.Online,
          UserStatus.Offline,
          UserStatus.Online,
          UserStatus.Offline,
        ]
    );
}

export function addUsers(users: UserInfo[], status: UserStatus[]) {
    assert(users.length === status.length);
    assert(userTreeDataProvider);
    for (let i = 0; i < users.length; i++) {
        userTreeDataProvider.users.push(new User(users[i], status[i]));
    }

    userTreeDataProvider.userGroups.push(
        new UserGroup(
            UserStatus.Online,
            userTreeDataProvider.users.filter(value => value.status === UserStatus.Online)
        ),
    );
    userTreeDataProvider.userGroups.push(
        new UserGroup(
            UserStatus.Offline,
            userTreeDataProvider.users.filter(value => value.status === UserStatus.Offline)
        ),
    );
    userTreeDataProvider.refresh();
}

export function deactivate() {}
