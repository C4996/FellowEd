// const Y = require("yjs");
// @ts-nocheck
import * as Y from "yjs";
export type YText = Y.Text;
export function createText(s: string) {
  return new Y.Text(s);
}
// import { WebsocketProvider } from "y-websocket";
const { WebsocketProvider } = require("y-websocket");
import ws from "ws";

export default function createWSClient(host: string, port: number | string) {
  const doc = new Y.Doc();
  const wsProvider = new WebsocketProvider(
    `ws://${host}:${port}`,
    "fed",
    doc,
    { WebSocketPolyfill: ws }
  );

  wsProvider.on("status", (event) => {
    console.log(event.status); // logs "connected" or "disconnected"
  });

  return {
    doc,
    wsProvider,
  };
}
