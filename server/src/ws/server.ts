import { WebSocketServer } from "ws";
import { logger } from "../utils/logger";
import { handleMessage } from "./message-handler";
import type { ClientMessage } from "@kodewords/shared/messages";
import type { Server as HttpServer } from "http";

export function createWsServer(server: HttpServer) {
  const wss = new WebSocketServer({ server });

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

    socket.on("close", () => {
      logger.info("Client disconnected");
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
