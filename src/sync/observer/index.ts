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
  // Initialize the virtual workspace
  // create virtual files for each key in the ymap
  for (const path in yFilesMap.keys) {
    console.info("=======ypath", { path });
    fs.writeFile(resolvePath(path, isClient), new Uint8Array(), {
      create: true,
      overwrite: true,
    });
  }
  yFilesMap.observe((event) => {
    /*     const allTabsUris = vscode.window.tabGroups.all.flatMap(({ tabs }) =>
      tabs.map((tab) => {
        if (
          tab.input instanceof vscode.TabInputText ||
          tab.input instanceof vscode.TabInputNotebook
        ) {
          return tab.input.uri;
        }

        if (
          tab.input instanceof vscode.TabInputTextDiff ||
          tab.input instanceof vscode.TabInputNotebookDiff
        ) {
          return tab.input.original; // also can use modified
        }

        // others tabs e.g. Settings or webviews don't have URI
        return null!;
      })
    ); */
    console.log("=====yjs is local", event.transaction.local, event.transaction.origin, event.keysChanged);
    if (event.transaction.local) {
      return;
    }
    const editors = vscode.window.visibleTextEditors;
    for (const path of event.keysChanged) {
      if (path?.endsWith(".git")) {
        continue;
      }
      // if (yFilesMap.get(path).from === (isClient ? "client" : "host")) {
      //   return;
      // }
      console.log("========yjs file changed:", { path });
      const textContent = yFilesMap.get(path).content;
      console.log("========yjs file content:", { textContent });
      const uri = resolvePath(path, isClient);

      const editor = editors.find((editor) => editor.document.uri.toString() === uri.toString());
      if (editor) {
        const editorText = editor.document.getText();
        if (textContent !== editorText) {
          editor.edit((editBuilder) => {
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
