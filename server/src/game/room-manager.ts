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

    for (const [existingRoomId, existingRoom] of this.rooms) {
      if (existingRoomId !== uniqueId) {
        existingRoom.players.delete(player.id);
      }
    }

    const alreadyInRoom = room.players.has(player.id);

    if (!alreadyInRoom) {
      room.players.set(player.id, player);
    }

    return room;
  }

  getRoom(id: string) {
    return this.rooms.get(id);
  }

  getRoomByRoomId(roomId: string, listType: ListType): Room | undefined {
    return this.rooms.get(`${roomId}-${listType}`);
  }

  leaveRoom(id: string, playerId: string): Room | undefined {
    const room = this.rooms.get(id);
    if (!room) {
      throw new Error(`Room with id ${id} not found`);
    }

    room.players.delete(playerId);
    return room;
  }

  selectWord(id: string, playerId: string, word: string) {
    const room = this.rooms.get(id);
    if (!room) {
      throw new Error(`Room with id ${id} not found`);
    }

    const player = room.players.get(playerId);
    if (!player) {
      throw new Error(`Player with id ${playerId} not found in room ${id}`);
    }

    const index = room.guessedWords.findIndex(guessedWord => guessedWord.word === word);
    if (index === -1) {
      room.guessedWords.push({ word, playerId });
    }
  }

  toggleWord(id: string, playerId: string, word: string) {
    const room = this.rooms.get(id);
    if (!room) {
      throw new Error(`Room with id ${id} not found`);
    }

    const player = room.players.get(playerId);
    if (!player) {
      throw new Error(`Player with id ${playerId} not found in room ${id}`);
    }

    const index = room.guessedWords.findIndex(guessedWord => guessedWord.word === word);
    if (index === -1) {
      room.guessedWords.push({ word, playerId });
    } else {
      room.guessedWords.splice(index, 1);
    }
  }

  getRoomByPlayerId(playerId: string): Room | undefined {
    for (const room of this.rooms.values()) {
      if (room.players.has(playerId)) {
        return room;
      }
    }
    return undefined;
  }
}

export const roomManager = new RoomManager();
