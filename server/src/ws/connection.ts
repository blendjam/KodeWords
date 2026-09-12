import type { Player } from "@kodewords/shared/types";
import type WebSocket from "ws";

export class Connection {
  constructor(
    private socket: WebSocket,
    private player: Player,
    private isAlive = true,
  ) {}

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

  setIsAlive(isAlive: boolean) {
    this.isAlive = isAlive;
  }

  getIsAlive() {
    return this.isAlive;
  }
}
