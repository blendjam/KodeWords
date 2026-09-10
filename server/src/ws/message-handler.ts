import type { ClientMessage } from "@kodewords/shared/messages";
import type { WebSocket } from "ws";
import { roomManager } from "../game/room-manager";
import { serializeRoom } from "../../../shared/room";

function handleJoinRoom(socket: WebSocket, message: Extract<ClientMessage, { type: "join_room" }>) {
  const room = roomManager.joinRoom(
    message.roomId,
    {
      id: message.userId,
      name: message.userId,
      role: message.role,
    },
    message.listType,
  );
  const msg = JSON.stringify({
    type: "room_state",
    payload: serializeRoom(room),
  });
  socket.send(msg);
}

function handelGuessWord(
  socket: WebSocket,
  message: Extract<ClientMessage, { type: "guess_word" }>,
) {}

export function handleMessage(socket: WebSocket, message: ClientMessage) {
  switch (message.type) {
    case "join_room":
      handleJoinRoom(socket, message);
      break;
    case "guess_word":
      handelGuessWord(socket, message);
      break;
    default: {
      const _exhaust: never = message;
      throw new Error(`Unhandled message type ${JSON.stringify(_exhaust)}`);
    }
  }
}
