const Y = require("yjs");
// import { WebsocketProvider } from "y-websocket";
const { WebsocketProvider } = require("y-websocket");
import ws = require("ws");

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
