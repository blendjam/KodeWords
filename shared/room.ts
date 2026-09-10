import type { Room, SerializedRoom } from "@kodewords/shared/types";

export function serializeRoom(room: Room): SerializedRoom {
  return {
    ...room,
    players: [...room.players.values()],
  };
}

export function deserializeRoom(room: SerializedRoom): Room {
  return {
    ...room,
    players: new Map(room.players.map(player => [player.id, player])),
  };
}
