export type Color = "red" | "blue" | "gray" | "black";
export type CardType = "neutral" | "assassin" | "red" | "blue";

type CardProps = {
  word: string;
  type: Color;
  showColor?: boolean;
  id: number;
};

type WordType = {
  word: string;
  type: CardType;
  id?: number;
};

type WordListType = {
  [key: string]: string[];
};

export type { CardProps, WordType, WordListType };
