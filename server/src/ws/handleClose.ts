import type WebSocket from "ws";
import { logger } from "../utils/logger";
import { connections } from "./connections";
import { roomManager } from "../game/room-manager";

export function handleClose(socket: WebSocket) {
  const player = connections.getPlayerFromSocket(socket);
  if (!player) return;

  roomManager.removePlayer(player.id);
  connections.removeConnection(player.id);
  logger.info("Client disconnected", { userId: player.id });
}
