import { FellowFS, File, Directory } from "../../fs/provider";

// import type { Doc, Map } from "yjs";
type Doc = any;
type Map = any;

export function observe(doc: Doc) {
  const ymap = doc.getMap();
  const fs = new FellowFS();
  // Initialize the virtual workspace
  // create virtual files for each key in the ymap
  for (const filename in ymap.keys) {
    // TODO
    fs.root.entries.set(filename, new File(filename));
  }
  ymap.observe((event) => {
    console.log("========yjs", { event });
    for (const filename in event.keysChanged) {
        // TODO
    }
  });
}
