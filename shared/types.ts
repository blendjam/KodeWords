export type Role = "spymaster" | "operative";

export type ListType = "vanilla" | "classic" | "extreme";

export interface Player {
  id: string;
  name: string;
  role: Role | null;
}

export type Room = {
  id: string;
  roomId: string;
  players: Map<string, Player>;
  words: string[];
  guessedWords: { word: string; playerId: string }[];
  listType: ListType;
};

export type SerializedRoom = {
  id: string;
  roomId: string;
  players: Player[];
  words: string[];
  guessedWords: { word: string; count: number; playerId: string }[];
  listType: ListType;
};

export const ConnectionStatus = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  CONNECTING: "CONNECTING",
};
