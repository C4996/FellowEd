// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { addMultipleCursors, getAllUsers, helloWorld, joinSession, jumpToLine, openVirtualFile, showFileInfo, startSession } from "./commands";
import { virtualDocumentScheme, VirtualDocumentProvider } from "./virtualDocument";
import { virtualFileSystemProvider, virtualFileSystemScheme } from "./virtualFileSystem";
import { openVirtualFile1 } from "./commands";
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
    ),
    vscode.commands.registerCommand(
      "fellowed.openVirtualFile",
      openVirtualFile
    ),
    vscode.commands.registerCommand(
      "fellowed.addMultipleCursors",
      addMultipleCursors
    )
    ,
    vscode.commands.registerCommand(
      "fellowed.openVirtualFile1",
      openVirtualFile1
    ),
    // vscode.workspace.registerTextDocumentContentProvider(virtualDocumentScheme, VirtualDocumentProvider),
    vscode.workspace.registerFileSystemProvider(virtualFileSystemScheme, virtualFileSystemProvider, { isCaseSensitive: true }),
  ];
  commands.forEach((value) => context.subscriptions.push(value));
}

// This method is called when your extension is deactivated
export function deactivate() { }
