import { FellowFS } from "./fs/provider";
import * as vscode from "vscode";

export class ExtensionContext {
  private static instance: ExtensionContext;
  fs?: FellowFS;
  ext: vscode.ExtensionContext;

  private constructor() {}

  public static getInstance(): ExtensionContext {
    if (!ExtensionContext.instance) {
      ExtensionContext.instance = new ExtensionContext();
    }
    return ExtensionContext.instance;
  }
}