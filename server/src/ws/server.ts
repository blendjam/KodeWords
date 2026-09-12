import { WebSocketServer } from "ws";
import { logger } from "../utils/logger";
import { handleMessage } from "./message-handler";
import type { ClientMessage } from "@kodewords/shared/messages";
import type { Server as HttpServer } from "http";
import { handleClose } from "./handleClose";
import { connections } from "./connections";

const HEARTBEAT_INTERVAL = 30_000;

export function createWsServer(server: HttpServer) {
  const wss = new WebSocketServer({ server });

  const interval = setInterval(() => {
    wss.clients.forEach(socket => {
      const connection = connections.getConnectionFromSocket(socket);
      if (!connection) return;
      if (!connection.getIsAlive()) {
        socket.terminate();
        return;
      }
      connection.setIsAlive(false);
      socket.ping();
    });
  }, HEARTBEAT_INTERVAL);

  wss.on("connection", socket => {
    logger.info("Client Connected");
    socket.on("message", raw => {
      let message: ClientMessage;
      try {
        message = JSON.parse(raw.toString());
      } catch (err) {
        logger.warn("Malformed MSG", { msg: raw.toString(), err: String(err) });
        return;
      }
      try {
        handleMessage(socket, message);
      } catch (err) {
        logger.error("Error Handling MSG", { err: String(err), message });
      }
    });

    socket.on("pong", () => {
      const connection = connections.getConnectionFromSocket(socket);
      if (connection) {
        connection.setIsAlive(true);
      }
    });

    socket.on("close", () => {
      handleClose(socket);
      clearInterval(interval);
    });

    socket.on("error", err => {
      logger.error("Socket Error", { err: String(err) });
    });
  });

  wss.on("error", err => {
    logger.error("WebsocketServer: Error", { error: String(err) });
  });
  return wss;
}
