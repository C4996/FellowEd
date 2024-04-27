import * as vscode from "vscode";
import { stat } from "fs/promises";
// import { promisify } from "util"; // Node.js now has fs/promises, so we don't need this anymore
async function getFileMetadata(filePath: string) {
  try {
    const fileStat = await stat(filePath);
    return {
      created: fileStat.birthtime,
      modified: fileStat.mtime,
      size: fileStat.size,
    };
  } catch (error) {
    vscode.window.showErrorMessage(`Error: ${error}`);
  }
}

export async function jumpToLine(line: number) {
  const userInput = await vscode.window.showInputBox({
    prompt: "请输入要跳转到的行数",
    placeHolder: "在这里输入行数",
  });
  const editor = vscode.window.activeTextEditor;
  if (!userInput) {
    vscode.window.showErrorMessage("请输入行数！");
  }
  if (!editor) {
    vscode.window.showErrorMessage("请打开一个文件！");
  }
  try {
    if (userInput !== undefined && editor !== undefined) {
      const line = parseInt(userInput);
      const range = editor.document.lineAt(line).range;
      editor.selection = new vscode.Selection(range.start, range.end);
      editor.revealRange(range);
    }
  } catch (err) {
    vscode.window.showErrorMessage("请输入一个有效的行数！");
  }
}

export async function showFileInfo() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const document = editor.document;
    const text = document.getText();
    const filePath = document.uri.fsPath;

    vscode.window.showInformationMessage(`File path: ${filePath}`);
    vscode.window.showInformationMessage(`File content: ${text}`);
    const detailInfo = await getFileMetadata(filePath);
    try {
      const fileStat = await stat(filePath);
      vscode.window.showInformationMessage(`Created: ${fileStat.birthtime}`);
      vscode.window.showInformationMessage(`Modified: ${fileStat.mtime}`);
      vscode.window.showInformationMessage(`Size: ${fileStat.size}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Error: ${error}`);
    }
  } else {
    vscode.window.showErrorMessage("No active editor found!");
  }
}

export async function helloWorld() {
  // The code you place here will be executed every time your command is executed
  // Display a message box to the user
  vscode.window.createTerminal("Fellowed Terminal");
  vscode.window.showInformationMessage("Hello World from fellowed!");
}