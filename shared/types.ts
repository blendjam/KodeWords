export type Role = "spymaster" | "operative";

export type ListType = "vanilla" | "classic" | "extreme";

export type Player = {
  id: string;
  name: string;
  role: Role;
};

export type Room = {
  id: string;
  roomId: string;
  players: Map<string, Player>;
  words: string[];
  guessedWords: string[];
  listType: ListType;
};

export type SerializedRoom = {
  id: string;
  roomId: string;
  players: Player[];
  words: string[];
  guessedWords: string[];
  listType: ListType;
};
