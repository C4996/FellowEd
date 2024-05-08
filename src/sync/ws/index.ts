// const WebSocket = require("ws");
// const http = require("http");
// const setupWSConnection = require("./utils.cjs").setupWSConnection;
import ws from "ws";
import http from "http";
// import { setupWSConnection } from "./utils";
const setupWSConnection = require("./utils.cjs").setupWSConnection;
const wss = new ws.Server({ noServer: true });

export default function createWSServer(host: string, port: number) {
  const server = http.createServer((_request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("okay");
  });

  wss.on("connection", setupWSConnection);

  server.on("upgrade", (request, socket, head) => {
    // You may check auth of request here..
    // Call `wss.HandleUpgrade` *after* you checked whether the client has access
    // (e.g. by checking cookies, or url parameters).
    // See https://github.com/websockets/ws#client-authentication
    wss.handleUpgrade(
      request,
      socket,
      head,
      /** @param {any} ws */ (ws) => {
        wss.emit("connection", ws, request);
      }
    );
  });

  server.listen(port, host, () => {
    console.log(`Websocket server running at '${host}' on port ${port}`);
  });

  return server;
}
