// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { helloWorld, jumpToLine, showFileInfo, runServer } from "./commands";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "fellowed" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposableHelloWorld = vscode.commands.registerCommand(
    "fellowed.helloWorld",
    helloWorld
  );
  let disposableScrollToLine = vscode.commands.registerCommand(
    "fellowed.scrollToLine",
    jumpToLine
  );
  let disposableShowFileInfo = vscode.commands.registerCommand(
    "fellowed.showFileInfo",
    showFileInfo
  );
  let disposableRunServer = vscode.commands.registerCommand(
    "fellowed.runServer",
    runServer
  );
  context.subscriptions.push(disposableHelloWorld);
  context.subscriptions.push(disposableScrollToLine);
}

// This method is called when your extension is deactivated
export function deactivate() { }
