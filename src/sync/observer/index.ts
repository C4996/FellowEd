import { FellowFS, File, Directory } from "../../fs/provider";
import * as vscode from "vscode";

// import type { Doc as YDoc, Map as YMap } from "yjs";
type YDoc = any;
type YMap = any;

const encoder = new TextEncoder();

export function observe(doc: YDoc, fs: FellowFS) {
  const yFilesMap = doc.getMap("files");
  const yCursorsMap = doc.getMap("cursors");
  console.info("=======yarr", yCursorsMap);
  // Initialize the virtual workspace
  // create virtual files for each key in the ymap
  for (const path in yFilesMap.keys) {
    const filename = path.split("/")?.at(-1);
    if (!filename) {
      continue;
    }
    console.info("=======yfilenmae", { filename });
    fs.writeFile(vscode.Uri.parse(`fedfs:/${filename}`), new Uint8Array(), {
      create: true,
      overwrite: true,
    });
  }
  yFilesMap.observe((event) => {
    console.log("========yjs", { event });
    for (const filename of event.keysChanged) {
      console.log("========yjs file changed:", { filename });
      const textContent = yFilesMap.get(filename);
      console.log("========yjs file content:", { textContent });
      const uri = vscode.Uri.parse(`fedfs:/${filename}`);
      fs.writeFile(uri, encoder.encode(textContent as string), {
        create: true,
        overwrite: true,
      });
      vscode.window.showTextDocument(uri);
    }
  });
}
