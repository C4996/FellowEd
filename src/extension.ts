// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getAllUsers, helloWorld, joinSession, jumpToLine, showFileInfo, startSession } from "./commands";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "fellowed" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let commands: vscode.Disposable[] = [
    vscode.commands.registerCommand(
      "fellowed.helloWorld",
      helloWorld
    ),
    vscode.commands.registerCommand(
      "fellowed.scrollToLine",
      jumpToLine
    ),
    vscode.commands.registerCommand(
      "fellowed.joinSession",
      joinSession,
    ),
    vscode.commands.registerCommand(
      "fellowed.startSession",
      startSession
    ),
    vscode.commands.registerCommand(
      "fellowed.getAllUsers",
      getAllUsers,
    )
  ];
  commands.forEach((value) => context.subscriptions.push(value));
}

// This method is called when your extension is deactivated
export function deactivate() { }
