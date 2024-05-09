import * as vscode from 'vscode';
import { msgHandler } from '../message';
import * as path from 'path';
import { message, Message } from '../schema/chat';


let webviewPanel: vscode.WebviewPanel | undefined;
function getChatViewHTML(jsUrl: vscode.Uri, cssUrl: vscode.Uri) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script>
        const vscode = acquireVsCodeApi();
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'receiveMsgs':
                    console.log("you have received a message");
                window.dispatchEvent(new CustomEvent('receiveMmsgs', { detail: message.msgs }));
                break;
            }
        });
      </script>
      <script type="module" src="${jsUrl}"></script>
      <link rel="stylesheet" href="${cssUrl}">
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
    const indexJsPath = vscode.Uri.file(
        path.join(context.extensionPath, './out/static/webview', 'index.js')
    );
    const indexCssPath = vscode.Uri.file(
        path.join(context.extensionPath, './out/static/webview', 'index.css')
    );
    const indexJsUrl = panel.webview.asWebviewUri(indexJsPath);
    const indexCssUrl = panel.webview.asWebviewUri(indexCssPath);
    panel.webview.html = getChatViewHTML(indexJsUrl, indexCssUrl);

    panel.webview.onDidReceiveMessage(msgHandler, undefined, context.subscriptions);
    panel.webview.postMessage({
        command: 'receiveMsgs', msgs: [
            { text: 'Hello World!', user: 'vscode' },
            { text: 'Hello World!', user: 'vscode' },
            { text: 'Hello World!', user: 'vscode' }
        ]
    });
    webviewPanel = panel;
}

export function testMsgFunction() {
    if (webviewPanel) {
        webviewPanel.webview.postMessage({ command: 'receiveMsgs', msgs : [{
            text: 'Hello World!',
            user: 'vscode'
        }] });
    }
}
