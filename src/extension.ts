// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  getAllUsers,
  helloWorld,
  openTab,
  closeTab,
  joinSession,
  jumpToLine,
  showFileInfo,
  startSession,
  showAvailableIP
} from "./commands";
import { openChatView, testMsgFunction } from "./webview/webview";
import { userListActivate } from "./client/treeview";
import { FellowFS } from "./fs/provider";
import { ExtensionContext } from "./context";
import { Config } from "./global";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "FellowEd: stopped";
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
  Config.getInstance().statusBarItem = statusBarItem;

  console.log('Congratulations, your extension "fellowed" is now active!');
  userListActivate(context);
  const memFs = new FellowFS();

  context.subscriptions.push(vscode.workspace.registerFileSystemProvider("fedfs", memFs, {
    isCaseSensitive: false,
  }));
  const ctx = ExtensionContext.getInstance();
  ctx.fs = memFs;
  ctx.ext = context;
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let commands: vscode.Disposable[] = [
    vscode.commands.registerCommand("fellowed.helloWorld", helloWorld),
    vscode.commands.registerCommand("fellowed.openTab", openTab),
    vscode.commands.registerCommand("fellowed.closeTab", closeTab),
    vscode.commands.registerCommand("fellowed.scrollToLine", jumpToLine),
    vscode.commands.registerCommand("fellowed.joinSession", joinSession),
    vscode.commands.registerCommand("fellowed.startSession", startSession),
    vscode.commands.registerCommand("fellowed.getAllUsers", getAllUsers),
    vscode.commands.registerCommand("fellowed.openChatView", openChatView),
    vscode.commands.registerCommand("fellowed.showAvailableIP", showAvailableIP),
    vscode.commands.registerCommand(
      "fellowed.testMsgFunction",
      testMsgFunction
    ),
  ];

  commands.forEach((value) => context.subscriptions.push(value));
}

// This method is called when your extension is deactivated
export function deactivate() { }
