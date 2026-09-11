import wordListJSON from "./words_list.json";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { WordListType } from "./types/types";
import { useRoomState } from "./state/roomState";
import { FullScreenButton } from "./components/fullScreenButton";
import { ConnectionStatus, ListType, Role } from "@kodewords/shared/types";
import { useWs } from "./hooks/wsContext";
import Board from "./components/board";
import { getRandomRoomId } from "@kodewords/shared/room";

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

function Game() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clearRoom = useRoomState(state => state.clearRoom);
  const room = useRoomState(state => state.room);
  const roomId = (searchParams.get("id") as string) || getRandomRoomId();
  const role = (searchParams.get("role") as Role) || "operative";
  const listType = (searchParams.get("list") as ListType) || "classic";
  const { connectionStatus, send } = useWs();

  useEffect(() => {
    if (connectionStatus !== ConnectionStatus.CONNECTED || !roomId || !role || !listType) return;
    send({ type: "join_room", roomId, role, listType });
  }, [connectionStatus, listType, role, roomId, send]);

  const turn = useMemo(() => {
    const seed = room?.roomId ? Number(roomId) : 0;
    return RNG(seed * 10)() > 0.5 ? "red" : "blue";
  }, [room, roomId]);

  const shuffledWords = useMemo(() => {
    const boardRoomId = room?.roomId ?? roomId;
    const boardListType = room?.listType ?? listType;
    return generateBoard(Number(boardRoomId), boardListType, turn);
  }, [listType, room, roomId, turn]);

  const handleBack = () => {
    send({ type: "leave_room", roomId });
    clearRoom();
    navigate("/");
  };

  return (
    <main
      className={`relative flex h-screen w-screen flex-col items-center  overflow-auto 
        ${
          turn === "red"
            ? "bg-[radial-gradient(circle,#e48957,#461408)]"
            : "bg-[radial-gradient(circle,#58c7e3,#082b4a)]"
        }`}>
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" />

      <nav className="z-10 flex w-full items-center justify-between px-2 mt-2">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className=" rounded-lg bg-white px-2 py-1 font-bold text-[#222] text-[10px]">
            HOME
          </button>
          <h4
            className={` rounded-md px-2 py-1 text-[10px] font-bold text-white
            ${
              turn === "red"
                ? "bg-linear-to-br from-[#d25028] to-[#ed8745]"
                : "bg-linear-to-br from-[#57bfd4] to-[#3a6c9d]"
            }
          `}>
            {turn.toUpperCase()}
          </h4>
          <span className="text-white text-[10px]">Plays First</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="rounded bg-black/25 px-4 py-1 text-white text-[10px]">ID: {roomId}</span>

          <div
            className={`rounded-full size-1.5 ${connectionStatus === ConnectionStatus.CONNECTED ? "bg-green-400" : "bg-red-500"}`}></div>
          <FullScreenButton />
        </div>
      </nav>
      <div className="w-full h-full flex items-center justify-center">
        <Board words={shuffledWords} role={role as Role} />
      </div>
    </main>
  );
}

export default Game;
