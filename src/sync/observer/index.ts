import { FellowFS, File, Directory } from "../../fs/provider";
import * as vscode from "vscode";
import { resolvePath } from "../../fs/resolver";

// import type { Doc as YDoc, Map as YMap } from "yjs";
type YDoc = any;
type YMap = any;

const encoder = new TextEncoder();

export function observe(
  doc: YDoc,
  fs: vscode.FileSystemProvider | vscode.FileSystem,
  isClient = true
) {
  const yFilesMap = doc.getMap("files");
  const yCursorsMap = doc.getMap("cursors");
  console.info("=======yarr", yCursorsMap);
  for (const path in yFilesMap.keys) {
    console.info("=======ypath", { path });
    fs.writeFile(resolvePath(path, isClient), new Uint8Array(), {
      create: true,
      overwrite: true,
    });
  }
  yFilesMap.observe((event) => {
    console.log("=====yjs is local", event.transaction.local, event.transaction.origin, event.keysChanged);
    if (event.transaction.local) {
      return;
    }

    for (const path of event.keysChanged) {
      if (path?.endsWith(".git")) {
        continue;
      }
      console.log("========yjs file changed:", { path });
      const textContent = yFilesMap.get(path).content;
      console.log("========yjs file content:", { textContent });
      const uri = resolvePath(path, isClient);

      if (
        vscode.window.activeTextEditor.document.uri.toString().endsWith(path)
      ) {
        const editorText = vscode.window.activeTextEditor.document.getText();
        if (textContent !== editorText) {
          vscode.window.activeTextEditor.edit((editBuilder) => {
            editBuilder.replace(
              new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(Number.MAX_VALUE, Number.MAX_VALUE)
              ),
              textContent as string
            );
          });
        }
      } else {
        fs.writeFile(uri, encoder.encode(textContent as string), {
          create: true,
          overwrite: true,
        });
        vscode.window.showTextDocument(uri);
      }
    }
  });
}
