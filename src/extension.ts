// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import Fastify from "fastify";
import getUserInfoHandler from "./user/getUserInfo";
import { helloWorld, jumpToLine, showFileInfo, startSession } from "./commands";
import { newTRPC } from "./client";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  var trpc: ReturnType<typeof newTRPC>["trpc"] | undefined;
  /* const fastify = Fastify({
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
  })(); */

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
  let disposableJoinSession = vscode.commands.registerCommand(
    "fellowed.joinSession",
    async () => {
      // ask user input
      let port = await vscode.window.showInputBox({
        prompt: "请输入端口号",
        placeHolder: "41131",
      });
      if (!port) {
        port = "41131";
      }
      trpc = newTRPC(parseInt(port)).trpc;
      vscode.window.showInformationMessage("Session started! port is " + port);
    }
  );
  let disposableStartSession = vscode.commands.registerCommand(
    "fellowed.startSession",
    startSession
  );
  context.subscriptions.push(disposableHelloWorld);
  context.subscriptions.push(disposableScrollToLine);
  let disposableGetAllUsers = vscode.commands.registerCommand(
    "fellowed.getAllUsers",
    async () => {
      if (trpc) {
        const resp = await trpc.getAllUsers.query();
        await vscode.window.showInformationMessage(JSON.stringify(resp));
      } else {
        vscode.window.showErrorMessage("请先创建或加入一个协作会话！");
      }
    }
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
