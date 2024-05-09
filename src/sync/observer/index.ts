import { FellowFS, File, Directory } from "../../fs/provider";

import type { Doc as YDoc, Map as YMap } from "yjs";
// type YDoc = any; type YMap = any;

export function observe(doc: YDoc) {
  const yFilesMap = doc.getMap("files");
  const yCursorsMap = doc.getMap("cursors");
  console.info("=======yarr", yCursorsMap);
  const fs = new FellowFS();
  // Initialize the virtual workspace
  // create virtual files for each key in the ymap
  for (const filename in yFilesMap.keys) {
    fs.root.entries.set(filename, new File(filename));
  }
  yFilesMap.observe((event) => {
    console.log("========yjs", { event });
    for (const filename in event.keysChanged) {
      // TODO
    }
  });
}
