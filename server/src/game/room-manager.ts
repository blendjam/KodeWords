import type { ListType, Player, Room } from "@kodewords/shared/types";

export class RoomManager {
  private rooms = new Map<string, Room>();

  joinRoom(id: string, player: Player, listType: ListType): Room {
    const randomRoomid = Math.floor(100 + Math.random() * 9000).toString();
    const roomId = id === "" ? randomRoomid : id;
    const uniqueId = `${roomId}-${listType}`;
    let room = this.rooms.get(uniqueId);

    if (!room) {
      room = {
        id: uniqueId,
        roomId,
        players: new Map(),
        words: [],
        guessedWords: [],
        listType: listType,
      };
      this.rooms.set(uniqueId, room);
    }

    const alreadyInRoom = room.players.has(player.id);

    if (!alreadyInRoom) {
      room.players.set(player.id, player);
    }

    return room;
  }

  getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }
}

export const roomManager = new RoomManager();
