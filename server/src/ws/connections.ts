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
    if (this.connections.has(userId)) {
      const connection = this.connections.get(userId);
      if (connection) {
        connection.getSocket().close();
        connection.setSocket(socket);
      }
    }
  }

  hasUserId(userId: string): boolean {
    return this.connections.has(userId);
  }

  getPlayerFromSocket(socket: WebSocket): Player | undefined {
    const connection = Array.from(this.connections.values()).find(conn => conn.getSocket() === socket);
    return connection?.getPlayer();
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
