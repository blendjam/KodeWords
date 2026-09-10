import wordListJSON from "./words_list.json";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "./Card";
import { useMemo, useState } from "react";
import { Color, WordListType } from "./types/types";
import { useRoomState } from "./state/roomState";
import { FullScreenButton } from "./components/fullScreenButton";
import { ListType } from "@kodewords/shared/types";

function RNG(seed: number) {
  const m_as_number = Math.pow(2, 53) - 111;
  const m = BigInt(Math.pow(2, 53)) - BigInt(111); // 2n**53n - 111n
  const a = BigInt("5667072534355537"); // 5667072534355537n
  let s = BigInt(seed) % m;

  return function () {
    s = (s * a) % m;
    return Number(s) / m_as_number;
  };
}

type Turn = "red" | "blue";

function generateBoard(roomId: number, listType: ListType, turn: Turn) {
  const wordList = (wordListJSON as WordListType)[listType ? listType : "classic"];
  const randomWordList: Array<string> = [];
  let i = 0;

  // Generate a random list of 25 words
  while (randomWordList.length < 25) {
    const r1 = Math.floor(RNG(Number(roomId))() * wordList.length);
    const r2 = Math.floor(RNG(r1 + i)() * wordList.length);
    const r3 = RNG(r1 + r2)() * wordList.length;
    const index = Math.floor(r3) % wordList.length;
    const word = wordList[index];
    if (!randomWordList.includes(word)) {
      randomWordList.push(word);
    }
    i++;
  }

  // Split the words into the different categories
  const redAmount = turn === "red" ? 9 : 8;
  const blueAmount = turn === "blue" ? 9 : 8;

  const grayWords = randomWordList.splice(0, 7);
  const redWords = randomWordList.splice(0, redAmount);
  const blueWords = randomWordList.splice(0, blueAmount);
  const blackWord = randomWordList[0];

  const tempWords = [
    ...redWords.map((word, i) => ({ word, type: "red", id: i })),
    ...blueWords.map((word, i) => ({ word, type: "blue", id: i })),
    { word: blackWord, type: "black", id: 0 },
    ...grayWords.map((word, i) => ({ word, type: "gray", id: i })),
  ];

  const temp_list = tempWords;
  const rng = RNG(Number(roomId));
  for (let i = 0; i < temp_list.length; i++) {
    const randomNumber = rng() * 987654321;
    const j = Math.floor(randomNumber) % temp_list.length;
    const temp = temp_list[i];
    temp_list[i] = temp_list[j];
    temp_list[j] = temp;
  }
  return temp_list;
}

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clearRoom = useRoomState(state => state.clearRoom);
  const listType = searchParams.get("list");
  const roomId = searchParams.get("id");
  const role = searchParams.get("role");
  const [turn] = useState<Turn>(RNG(Number(roomId) * 10)() > 0.5 ? "red" : "blue");

  const shuffledWords = useMemo(
    () => generateBoard(Number(roomId), listType as ListType, turn),
    [listType, roomId, turn],
  );

  const handleBack = () => {
    clearRoom();
    navigate("/");
  };

  return (
    <main
      className="
      relative
      flex
      h-screen
      w-screen
      flex-col
      items-center
      overflow-auto
      bg-[radial-gradient(circle,#e48957,#461408)]
    ">
      <div
        className="
        bg-dots
        pointer-events-none
        absolute
        inset-0
        opacity-20
        mix-blend-multiply
      "
      />

      <nav className="z-10 flex w-full items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className=" rounded-lg bg-white px-4 py-1 font-bold text-[#222]">
            HOME
          </button>

          <h4
            className={` rounded-md px-2 py-1 font-bold text-white
            ${
              turn === "red"
                ? "bg-linear-to-br from-[#d25028] to-[#ed8745]"
                : "bg-linear-to-br from-[#57bfd4] to-[#3a6c9d]"
            }
          `}>
            {turn.toUpperCase()}
          </h4>
        </div>

        <h1 className="font-bold text-white">{role?.toUpperCase()}</h1>

        <div className="flex items-center gap-4">
          <span className="rounded bg-black/25 px-4 py-1 text-white text-[clamp(0.7rem, 1.5vw, 1rem)]">
            ID: {roomId}
          </span>

          <FullScreenButton />
        </div>
      </nav>

      <div className="relative mx-auto my-auto aspect-8/5 w-[min(95vw,calc(85dvh*1.6))] rounded-2xl bg-[#222] p-3">
        <div className=" grid h-full w-full grid-cols-5 grid-rows-5 gap-2">
          {shuffledWords.map((card, index) => (
            <Card
              key={index}
              id={card.id}
              word={card.word}
              type={card.type as Color}
              showColor={role === "spymaster"}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Game;
