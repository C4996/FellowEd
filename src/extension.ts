// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import Fastify from "fastify";
import getUserInfoHandler from "./getUserInfo";

function scrollToLine(line: number) {
  const editor = vscode.window.activeTextEditor;
}
import * as fs from "fs";
import { promisify } from "util";

const stat = promisify(fs.stat);

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
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const fastify = Fastify({
    logger: true,
  });

  // Declare a route
  fastify.get("/", async function handler(request, reply) {
    return { hello: "from FellowED" };
  });

  fastify.get("/getUserInfo", getUserInfoHandler);

  // ... add new routes here

  (async () => {
    // Run the server!
    try {
      await fastify.listen({ port: 3000 });
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  })();

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "fellowed" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "fellowed.helloWorld",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.createTerminal("Fellowed Terminal");
      vscode.window.showInformationMessage("Hello World from fellowed!");
    }
  );
  let scrollToLine = vscode.commands.registerCommand(
    "fellowed.scrollToLine",
    async () => {
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
  );
  let show_file_info = vscode.commands.registerCommand(
    "fellowed.showFileInfo",
    async () => {
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
          vscode.window.showInformationMessage(
            `Created: ${fileStat.birthtime}`
          );
          vscode.window.showInformationMessage(`Modified: ${fileStat.mtime}`);
          vscode.window.showInformationMessage(`Size: ${fileStat.size}`);
        } catch (error) {
          vscode.window.showErrorMessage(`Error: ${error}`);
        }
      } else {
        vscode.window.showErrorMessage("No active editor found!");
      }
    }
  );
  context.subscriptions.push(disposable);
  context.subscriptions.push(scrollToLine);
}

// This method is called when your extension is deactivated
export function deactivate() {}
