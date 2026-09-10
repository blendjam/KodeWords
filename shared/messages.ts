import { ListType, Role } from "./types";

export type ClientMessage =
  | { type: "join_room"; roomId: string; userId: string; role: Role; listType: ListType }
  | { type: "guess_word"; word: string; count: number };

export type ServerMessage =
  | { type: "room_state"; payload: unknown } // replace `unknown` with your actual game state shape
  | { type: "error"; message: string };
