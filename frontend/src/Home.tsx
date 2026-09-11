import wordList from "./words_list.json";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ListType, Role } from "@kodewords/shared/types";
import { FullScreenButton } from "./components/fullScreenButton";
import { getRandomRoomId } from "@kodewords/shared/room";

function Home() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [selectedList, setSelectedList] = useState<ListType>("classic");

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(event.target.value);
  };

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedList(event.target.value as ListType);
  };

  const onJoinButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const role = event.currentTarget.value as Role;
    const id = roomId === "" ? getRandomRoomId() : roomId;

    const params = new URLSearchParams({
      id,
      list: selectedList,
      role,
    });
    navigate(`/game?${params.toString()}`, {
      replace: true,
    });
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--base", "radial-gradient(circle,#383838 0%, #2f2f2f 100%)");
  }, []);

  return (
    <div className="dotted-bg flex h-screen w-screen flex-col items-center justify-start ">
      <h1 className="m-4 text-[2rem] font-bold text-white">KodeWords</h1>
      <div className="absolute top-0 right-0 -translate-x-4 translate-y-4">
        <FullScreenButton />
      </div>
      <div className="flex items-center justify-center">
        <input
          placeholder="Enter Room ID"
          onChange={onInputChange}
          value={roomId}
          type="number"
          className="m-2 h-18 w-60 rounded-2xl bg-white p-4 text-[1.5rem] text-[#222] outline-none focus:ring-2 focus:ring-white/50 "
        />

        <select
          name="select"
          onChange={onSelectChange}
          defaultValue={selectedList}
          className=" h-15 rounded-xl bg-white px-1 text-[1rem] text-[#222] outline-none focus:ring-2 focus:ring-white/50 ">
          {Object.keys(wordList).map(wordListName => (
            <option key={wordListName} value={wordListName}>
              {wordListName.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center justify-center">
        <button
          className="m-2 flex items-center justify-center whitespace-nowrap rounded-2xl bg-linear-to-br from-[#ff4e18] to-[#ed8744] px-8 py-4 text-[1.5rem] font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 "
          onClick={onJoinButtonClick}
          value="spymaster">
          Join as Spymaster
        </button>

        <button
          className=" m-2 flex items-center justify-center whitespace-nowrap rounded-2xl bg-[#f3e1c7] px-8 py-4 text-[1.5rem] font-bold text-[#222] transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 "
          onClick={onJoinButtonClick}
          value="operative">
          Join as Operative
        </button>
      </div>
    </div>
  );
}

export default Home;
