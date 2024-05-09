import { FellowFS } from "./fs/provider";

export class ExtensionContext {
  private static instance: ExtensionContext;
  fs?: FellowFS;

  private constructor() {}

  public static getInstance(): ExtensionContext {
    if (!ExtensionContext.instance) {
      ExtensionContext.instance = new ExtensionContext();
    }
    return ExtensionContext.instance;
  }
}