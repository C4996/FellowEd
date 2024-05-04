import * as vscode from "vscode";

export const virtualDocumentScheme = "fellowed";

export const VirtualDocumentProvider = new (class implements vscode.TextDocumentContentProvider {
    provideTextDocumentContent(uri: vscode.Uri): string {
        vscode.window.showInformationMessage(`uri: ${uri}`);
        return `Hello, world!`;
    }
})();

