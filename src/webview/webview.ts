import * as vscode from 'vscode';
import { msgHandler } from '../message';
import * as path from 'path';

function getChatViewHTML(url: vscode.Uri) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script>
        const vscode = acquireVsCodeApi();
      </script>
      <script type="module" src="${url}"></script>
      <title>Vue WebView</title>
    </head>
    <body>
      <div id="app"></div>
      
    </body>
    </html>
  `;
}


export function openChatView(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        "chatView",
        "Chat",
        vscode.ViewColumn.One,
        {
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, './out/static/webview/'))
            ],
            enableScripts: true,
        }
    );
    const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, './out/static/webview', 'index.js')
    );
    const webviewUrl = panel.webview.asWebviewUri(onDiskPath);

    panel.webview.html = getChatViewHTML(webviewUrl);
    console.log(panel.webview.html);
    panel.webview.onDidReceiveMessage(msgHandler, undefined, context.subscriptions);
    
}

