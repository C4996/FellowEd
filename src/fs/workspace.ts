import * as vscode from "vscode";

export async function listDir() {
  let workspaceFolder: vscode.WorkspaceFolder | undefined =
    vscode.workspace.workspaceFolders.at(0);

  if (!workspaceFolder) {
    return undefined;
  }

  return vscode.workspace.fs.readDirectory(workspaceFolder.uri);
}
