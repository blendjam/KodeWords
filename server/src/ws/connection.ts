import type { Player } from "@kodewords/shared/types";
import type WebSocket from "ws";

export class Connection {
  private socket: WebSocket;
  private player: Player;

  constructor(socket: WebSocket, player: Player) {
    this.socket = socket;
    this.player = player;
  }

  getPlayer() {
    return this.player;
  }

  setSocket(socket: WebSocket) {
    this.socket = socket;
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  getSocket() {
    return this.socket;
  }
}
