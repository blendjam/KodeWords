import wordList from "./words_list.json";
import { ChangeEvent, useState } from "react";
import { useEffect } from "react";
import "./Home.css";
import { useWs } from "./hooks/wsContext";
import type { ListType, Role } from "@kodewords/shared/types";
import { Link } from "react-router-dom";

function Home() {
  const userId = "sanket123";
  const { send } = useWs();
  const [roomId, setRoomId] = useState("");
  const [selectedList, setSelectedList] = useState<ListType>("classic");

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(event.target.value);
  };

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log("Changed", e.target.value);
    setSelectedList(e.target.value as ListType);
  };
  const onJoinButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    document;
    const role = event.currentTarget.value as Role;
    send({
      type: "join_room",
      roomId,
      role,
      listType: selectedList,
      userId,
    });
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--base",
      "radial-gradient(circle,#383838 0%, #2f2f2f 100%)",
    );
  }, []);

  return (
    <div className="Home">
      <h1 className="Title">Home</h1>
      <div className="InputContainer">
        <input placeholder="Enter Room ID" onChange={onInputChange} value={roomId} type="number" />
        <select
          className="Dropdown"
          name="select"
          onChange={onSelectChange}
          defaultValue={selectedList}>
          {Object.keys(wordList).map(function (wordListName, i) {
            return (
              <option key={i} value={wordListName}>
                {wordListName.toUpperCase()}
              </option>
            );
          })}
        </select>
      </div>
      <div className="ButtonContainer">
        <button className="Button Spymaster" onClick={onJoinButtonClick} value="spymaster">
          Join as Spymaster
        </button>
        <button className="Button Operative" onClick={onJoinButtonClick} value="operative">
          Join as Operatives
        </button>
      </div>
    </div>
  );
}

export default Home;
