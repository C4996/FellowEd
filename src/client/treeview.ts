import * as vscode from "vscode";
import { UserInfo } from "../schema/userInfo";
// import assert from 'assert';
import assert = require("assert");

export enum UserStatus {
  Online = "online",
  Offline = "offline",
}

class User {
  public name: string;
  public uuid: string;
  public status: UserStatus;
  public role: string;
  constructor(userInfo: UserInfo, status: UserStatus) {
    this.name = userInfo.name!;
    this.uuid = userInfo.userId!;
    this.status = status;
    this.role = userInfo.role!;
  }
}

class UserGroup {
  constructor(public status: UserStatus, public users: User[]) {}
}

class UserTreeDataProvider
  implements vscode.TreeDataProvider<User | UserGroup>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    User | UserGroup | undefined | null | void
  > = new vscode.EventEmitter<User | UserGroup | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    User | UserGroup | undefined | null | void
  > = this._onDidChangeTreeData.event;

  public users: User[] = [];
  public userGroups: UserGroup[] = [
    new UserGroup(UserStatus.Online, []),
    new UserGroup(UserStatus.Offline, []),
  ];

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getChildren(element?: User | UserGroup) {
    if (!element) {
      return this.userGroups;
    }
    if (element instanceof UserGroup) {
      return element.users;
    }
    return [];
  }

  getTreeItem(element: User | UserGroup): vscode.TreeItem {
    if (element instanceof UserGroup) {
      const treeItem = new vscode.TreeItem(
        element.status === UserStatus.Online ? "Online" : "Offline",
        vscode.TreeItemCollapsibleState.Collapsed
      );
      treeItem.contextValue = "userGroup";
      return treeItem;
    } else {
      const treeItem = new vscode.TreeItem(
        element.name,
        vscode.TreeItemCollapsibleState.None
      );
      treeItem.iconPath = new vscode.ThemeIcon(
        element.status === UserStatus.Online
          ? "circle-filled"
          : "circle-outline"
      );
      treeItem.description = element.role;
      return treeItem;
    }
  }
}

let userTreeDataProvider: UserTreeDataProvider;

export function userListActivate(context: vscode.ExtensionContext) {
  userTreeDataProvider = new UserTreeDataProvider();
  vscode.window.registerTreeDataProvider("userList", userTreeDataProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand("userList.refresh", () => {
      userTreeDataProvider.refresh();
    })
  );

  // examples:
  addUsers(
    [
      {
        machineId: vscode.env.machineId,
        lastLoginTime: new Date().toISOString(),
        userId: "1",
        role: "maintainer",
        name: "AAAA",
        email: "example@example.com",
      },
      {
        machineId: vscode.env.machineId,
        lastLoginTime: new Date().toISOString(),
        userId: "2",
        role: "developer",
        name: "BBBB",
        email: "example@example.com",
      },
      {
        machineId: vscode.env.machineId,
        lastLoginTime: new Date().toISOString(),
        userId: "3",
        role: "maintainer",
        name: "CCCC",
        email: "example@example.com",
      },
      {
        machineId: vscode.env.machineId,
        lastLoginTime: new Date().toISOString(),
        userId: "4",
        role: "developer",
        name: "DDDD",
        email: "example@example.com",
      },
      {
        machineId: vscode.env.machineId,
        lastLoginTime: new Date().toISOString(),
        userId: "5",
        role: "visitor",
        name: "EEEE",
        email: "example@example.com",
      },
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

  userTreeDataProvider.userGroups[0].users = userTreeDataProvider.users.filter(
    (value) => value.status === UserStatus.Online
  );
  userTreeDataProvider.userGroups[1].users = userTreeDataProvider.users.filter(
    (value) => value.status === UserStatus.Offline
  );

  userTreeDataProvider.refresh();
}

export function deactivate() {}
