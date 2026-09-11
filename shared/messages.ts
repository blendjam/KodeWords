import type { ListType, Role } from "./types";

export type ClientMessagePayload =
  | { type: "login" }
  | { type: "join_room"; roomId: string; role: Role; listType: ListType }
  | { type: "leave_room"; roomId: string }
  | { type: "select_word"; word: string };

export type ClientMessage = ClientMessagePayload & { userId: string };

export type ServerMessage =
  | { type: "room_state"; payload: unknown } // replace `unknown` with your actual game state shape
  | { type: "room_not_found"; roomId: string }
  | { type: "error"; message: string };
