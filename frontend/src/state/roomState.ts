import { Room } from "@kodewords/shared/types";
import { create } from "zustand";

interface RoomState {
  room: Room | null;
  setRoom: (room: Room) => void;
  clearRoom: () => void;
}

export const useRoomState = create<RoomState>()(set => ({
  room: null,
  setRoom: room => set({ room }),
  clearRoom: () => set({ room: null }),
}));
