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

import Fastify from "fastify";
import getUserInfoHandler from "./server/getUserInfo";
import { ServerConfig } from "./server/config";
import { UserConfig } from "./config";
import { UserInfo } from "./schema/userInfo";

export async function runServer() {
  const fastify = Fastify({
    logger: true,
  });

  // Declare a route
  fastify.get("/", async function handler(request, reply) {
    return { hello: "from FellowED" };
  });

  fastify.get("/getUserInfo", getUserInfoHandler);

  // ... add new routes here

  const portStr = await vscode.window.showInputBox({
    prompt: '请输入服务器端口（按下 Esc 使用默认端口 49152）',
  });
  let serverPort: number;
  if (portStr === undefined) {
    serverPort = 49152;
  }

  const port = Number.parseInt(portStr!);

  if (port === Number.NaN || port < 100 || port > 65535) {
    serverPort = 49152;
  } else {
    serverPort = port;
  }

  vscode.window.showInformationMessage("Server: use port " + new String(serverPort));

  ServerConfig.getInstance().serverPort = serverPort;

  (async () => {
    // Run the server!
    try {
      await fastify.listen({ port: serverPort });
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  })();


  const userInfo = await askUserInfo();
  userInfo.priority = 'maintainer';
  const userConfig = UserConfig.getInstance();
  userConfig.userInfo = userInfo;
  userConfig.serverIP = '127.0.0.1';
  userConfig.serverPort = serverPort;
}

async function askUserInfo() {
  let machineId = vscode.env.machineId;
  let userName = "";
  let email: string | undefined;

  do {
    userName = await vscode.window.showInputBox({
      prompt: '请输入用户名，长度 3-10 个字符，由大小写英文字母、数字和下划线组成。',
    }) ?? "???";
  } while (!(/^[a-zA-Z0-9_]{3,10}$/.test(userName)));

  do {
    email = await vscode.window.showInputBox({
      prompt: '请输入邮箱，按 Esc 跳过。',
    });
    if (email === undefined) {
      break;
    }
  } while (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email!));
 
  const result: UserInfo =  {
    machineId: machineId,
    name: userName,
    email: email,
    priority: "developer"
  };
  return result;
}



export async function connectServer() {

}