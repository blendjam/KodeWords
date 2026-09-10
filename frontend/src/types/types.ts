type CardProps = {
  word: string;
  type: string;
  showColor?: boolean;
  id?: number;
};

type WordType = {
  word: string;
  type: string;
  id?: number;
};

type WordListType = {
  [key: string]: string[];
};

export type { CardProps, WordType, WordListType };
