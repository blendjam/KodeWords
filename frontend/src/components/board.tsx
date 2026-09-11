import { Role } from "@kodewords/shared/types";
import type { Color } from "../types/types";
import Card from "../Card";

function Board({ words, role }: { words: { word: string; id: number; type: string }[]; role: Role }) {
  return (
    <div className="relative mx-auto my-auto aspect-8/5 w-[min(95vw,calc(85dvh*1.6))] rounded-2xl bg-[#222] p-3">
      <div className=" grid h-full w-full grid-cols-5 grid-rows-5 gap-2">
        {words.map((card, index) => (
          <Card key={index} id={card.id} word={card.word} type={card.type as Color} showColor={role === "spymaster"} />
        ))}
      </div>
    </div>
  );
}

export default Board;
