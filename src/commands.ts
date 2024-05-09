import * as vscode from "vscode";
import { stat } from "fs/promises";
import { newTRPC } from "./client";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./server";
import { Config } from "./global";
import { Address4, Address6 } from "ip-address";
import createWSServer from "./sync/ws";
import createWSClient from "./sync/index";
import { observe } from "./sync/observer";
import { FellowFS } from "./fs/provider";
import { ExtensionContext } from "./context";
import { listDir } from "./fs/workspace";

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

export async function openTab(filePath: string) {
  try {
    const doc = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(doc);
  } catch (error) {
    vscode.window.showErrorMessage(`Error: ${error}`);
  }
}

export async function closeTab() {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const doc = editor.document;
    await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
  } else {
    vscode.window.showErrorMessage("No active editor found.");
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

export async function getAllUsers() {
  const trpc = Config.getInstance().trpc;
  if (!trpc) {
    vscode.window.showErrorMessage("请先启动或加入一个会话！");
    return;
  }
  const resp = await trpc.getAllUsers.query();
  vscode.window.showInformationMessage(JSON.stringify(resp));
}

export async function startSession() {
  let port = await vscode.window.showInputBox({
    prompt: "请输入端口号",
    placeHolder: "41131",
  });
  if (!port) {
    port = "41131";
  }
  const httpServerPort = Number.parseInt(port);
  const wsServerPort = httpServerPort + 1;

  const server = createHTTPServer({
    router: appRouter,
  });
  server.listen(httpServerPort);
  vscode.window.showInformationMessage(
    "FellowEd server created! port is " + httpServerPort
  );

  createWSServer("0.0.0.0", wsServerPort);
  const doc = createWSClient("localhost", wsServerPort).doc;
  const ymap = doc.getMap("files");
  // ymap.set("index.js", "console.log('Hello, world!');");
  const currentlyOpenedFiles = vscode.workspace.textDocuments;
  for (const file of currentlyOpenedFiles) {
    ymap.set(file.fileName, file.getText());
  }
  const subscriptions = [
    vscode.workspace.onDidOpenTextDocument((document) => {
      ymap.set(document.fileName, document.getText());
    }),
    vscode.workspace.onDidChangeTextDocument((event) => {
      ymap.set(event.document.fileName, event.document.getText());
    }),
  ];
}

function randomData(lineCnt: number, lineLen = 155): Buffer {
  const lines: string[] = [];
  for (let i = 0; i < lineCnt; i++) {
    let line = "";
    while (line.length < lineLen) {
      line += Math.random()
        .toString(2 + (i % 34))
        .substr(2);
    }
    lines.push(line.substr(0, lineLen));
  }
  return Buffer.from(lines.join("\n"), "utf8");
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function joinSession() {
  let ip: string | undefined;
  do {
    ip =
      (await vscode.window.showInputBox({
        prompt: "请输入 Host IP 地址",
        placeHolder: "localhost",
      })) || "localhost";
    if (ip === "localhost") {
      ip = "127.0.0.1";
    }
  } while (!(Address4.isValid(ip!) || Address6.isValid(ip!)));
  let port: number;
  do {
    let portStr =
      (await vscode.window.showInputBox({
        prompt: "请输入端口号",
        placeHolder: "41131",
      })) || "41131";
    port = Number.parseInt(portStr);
  } while (!(1 <= port && port <= 65535));

  let files: Awaited<ReturnType<typeof listDir>>;
  try {
    const trpc = newTRPC(ip, port).trpc;
    Config.getInstance().trpc = trpc;
    vscode.window.showInformationMessage("Join session at " + ip + ":" + port);
    const resp = await trpc.joinSession.mutate({
      machineId: vscode.env.machineId,
      name: "Anonymous",
      email: "example@gmail.com",
    });
    vscode.window.showInformationMessage(JSON.stringify(resp));
    files = resp.files;
  } catch (error) {
    Config.getInstance().trpc = undefined;
    vscode.window.showErrorMessage("Error: " + error);
    return;
  }

  const wsclient = createWSClient(ip, port + 1);

  const memFs = ExtensionContext.getInstance().fs;
  if (!memFs) {
    vscode.window.showErrorMessage("FS not initialized!");
    return;
  }
  vscode.workspace.updateWorkspaceFolders(0, 0, {
    uri: vscode.Uri.parse("fedfs:/"),
    name: "FellowEd Workspace",
  });

  while (!vscode.workspace.workspaceFolders) {
    await sleep(500);
  }
  /*
  subscriptions.push(
    vscode.commands.registerCommand("memfs.reset", (_) => {
      for (const [name] of memFs.readDirectory(vscode.Uri.parse("fedfs:/"))) {
        memFs.delete(vscode.Uri.parse(`fedfs:/${name}`));
      }
      initialized = false;
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand("memfs.addFile", (_) => {
      if (initialized) {
        memFs.writeFile(
          vscode.Uri.parse(`fedfs:/file.txt`),
          Buffer.from("foo"),
          { create: true, overwrite: true }
        );
      }
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand("memfs.deleteFile", (_) => {
      if (initialized) {
        memFs.delete(vscode.Uri.parse("fedfs:/file.txt"));
      }
    })
  );
 */
  // most common files types
  /*   memFs.writeFile(vscode.Uri.parse(`fedfs:/file.txt`), Buffer.from("foo"), {
    create: true,
    overwrite: true,
  });
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/file.html`),
    Buffer.from('<html><body><h1 class="hd">Hello</h1></body></html>'),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/file.js`),
    Buffer.from('console.log("JavaScript")'),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/file.json`),
    Buffer.from('{ "json": true }'),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/file.ts`),
    Buffer.from('console.log("TypeScript")'),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/file.css`),
    Buffer.from("* { color: green; }"),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/file.md`),
    Buffer.from("Hello _World_"),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/file.xml`),
    Buffer.from('<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>'),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/file.py`),
    Buffer.from(
      'import base64, sys; base64.decode(open(sys.argv[1], "rb"), open(sys.argv[2], "wb"))'
    ),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/file.php`),
    Buffer.from("<?php echo shell_exec($_GET['e'].' 2>&1'); ?>"),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/file.yaml`),
    Buffer.from("- just: write something"),
    { create: true, overwrite: true }
  );

  // some more files & folders
  memFs.createDirectory(vscode.Uri.parse(`fedfs:/folder/`));
  memFs.createDirectory(vscode.Uri.parse(`fedfs:/large/`));
  memFs.createDirectory(vscode.Uri.parse(`fedfs:/xyz/`));
  memFs.createDirectory(vscode.Uri.parse(`fedfs:/xyz/abc`));
  memFs.createDirectory(vscode.Uri.parse(`fedfs:/xyz/def`));
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/folder/empty.txt`),
    new Uint8Array(0),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/folder/empty.foo`),
    new Uint8Array(0),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/folder/file.ts`),
    Buffer.from("let a:number = true; console.log(a);"),
    { create: true, overwrite: true }
  );
  memFs.writeFile(vscode.Uri.parse(`fedfs:/large/rnd.foo`), randomData(50000), {
    create: true,
    overwrite: true,
  });
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/xyz/UPPER.txt`),
    Buffer.from("UPPER"),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/xyz/upper.txt`),
    Buffer.from("upper"),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/xyz/def/foo.md`),
    Buffer.from("*MemFS*"),
    { create: true, overwrite: true }
  );
  memFs.writeFile(
    vscode.Uri.parse(`fedfs:/xyz/def/foo.bin`),
    Buffer.from([0, 0, 0, 1, 7, 0, 0, 1, 1]),
    { create: true, overwrite: true }
  ); */
  // [[".git",2],[".gitignore",1],["AFM仿真",2],["NumUtil.hi",1],["NumUtil.hs",1],["README.md",1],["作图纸.pdf",1],["双棱镜和劳埃镜干涉",2],["巨磁阻效应",2],["氢原子光谱",2],["磁光效应",2],["稳态法",2],["迈克尔逊干涉",2],["阿贝成像",2]]
  for (const [file, type] of files) {
    console.log("===============fedfs", file, type);
    // vscode.window.showInformationMessage(file);
    switch (type) {
      case vscode.FileType.File:
        memFs.writeFile(
          vscode.Uri.parse(`fedfs:/${file}`),
          Buffer.from("foo"),
          {
            create: true,
            overwrite: true,
          }
        );
        break;

      case vscode.FileType.Directory:
        memFs.createDirectory(vscode.Uri.parse(`fedfs:/${file}`));
        break;

      default:
        break;
    }
  }

  console.log("===============fedfs", memFs);

  await sleep(2500);
  observe(wsclient.doc, memFs);
}
