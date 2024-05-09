import * as vscode from "vscode";

export function clientUri2Path(s: string | vscode.Uri): string {
  s = s.toString().replaceAll("\\\\", "/").replaceAll("\\", "/");
  return s.split("/")!.at(-1);
}

export function hostUri2Path(s: string | vscode.Uri): string {
  s = s.toString().replaceAll("\\\\", "/").replaceAll("\\", "/");
  return s.split("/")!.at(-1);
}

export function path2ClientUri(s: string): vscode.Uri {
  return vscode.Uri.parse(`fedfs:/${s}`);
}

export function path2HostUri(s: string): vscode.Uri {
  return vscode.Uri.parse(`fedfs:/${s}`);
}

export function resolvePath(s: string, isClient: boolean) {
  return isClient ? path2ClientUri(s) : path2HostUri(s);
}
