import type { Room, SerializedRoom } from "@kodewords/shared/types";

export const getRandomRoomId = () => Math.floor(100 + Math.random() * 9000).toString();

export function serializeRoom(room: Room): SerializedRoom {
  return {
    ...room,
    players: [...room.players.values()],
    guessedWords: room.guessedWords.map(guessedWord => ({
      ...guessedWord,
      count: 1,
    })),
  };
}

export function deserializeRoom(room: SerializedRoom): Room {
  return {
    ...room,
    players: new Map(room.players.map(player => [player.id, player])),
    guessedWords: room.guessedWords.map(({ count, ...guessedWord }) => guessedWord),
  };
}
