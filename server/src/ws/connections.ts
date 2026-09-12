import type { Player } from "@kodewords/shared/types";
import type { Room } from "@kodewords/shared/types";
import type { Connection } from "./connection";
import type WebSocket from "ws";

export class Connections {
  connections: Map<string, Connection> = new Map();

  addConnection(userId: string, connection: Connection) {
    this.connections.set(userId, connection);
  }

  removeConnection(userId: string) {
    this.connections.delete(userId);
  }

  getConnection(userId: string): Connection | undefined {
    return this.connections.get(userId);
  }

  updatePlayer(userId: string, player: Player) {
    const connection = this.connections.get(userId);
    if (connection) {
      connection.setPlayer(player);
    }
  }

  updateSocket(userId: string, socket: WebSocket) {
    const connection = this.getConnection(userId);
    if (!connection) return;
    connection.setSocket(socket);
    connection.setIsAlive(true);
  }

  hasUserId(userId: string): boolean {
    return this.connections.has(userId);
  }

  getConnectionFromSocket(socket: WebSocket): Connection | undefined {
    return Array.from(this.connections.values()).find(conn => conn.getSocket() === socket);
  }

  getPlayerFromSocket(socket: WebSocket): Player | undefined {
    const conneciton = this.getConnectionFromSocket(socket);
    return conneciton?.getPlayer();
  }

  broadcastToRoom(room: Room, message: string) {
    for (const playerId of room.players.keys()) {
      const connection = this.connections.get(playerId);
      if (connection) {
        connection.getSocket().send(message);
      }
    }
  }
}

export const connections = new Connections();
