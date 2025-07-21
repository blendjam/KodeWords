import wordListJSON from "./words_list.json";
import { Link } from "react-router-dom";
import Card from "./Card";
import "./Game.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { WordListType, WordType } from "./types/types";

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

const Game = () => {
  const { listname, roomid, role } = useParams();
  const [shuffledWords, setShuffledWords] = useState<Array<WordType>>([]);
  const [turn, setTurn] = useState<"red" | "blue">(
    RNG(Number(roomid) * 10)() > 0.5 ? "red" : "blue"
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const wordList = (wordListJSON as WordListType)[
    listname ? listname : "classic"
  ];

  useEffect(() => {
    const randomWordList: Array<string> = [];
    let i = 0;

    // Generate a random list of 25 words
    while (randomWordList.length < 25) {
      const r1 = Math.floor(RNG(Number(roomid))() * wordList.length);
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
      { word: blackWord, type: "black" },
      ...grayWords.map((word, i) => ({ word, type: "gray", id: i })),
    ];

    setTurn(RNG(Number(roomid) * 10)() > 0.5 ? "red" : "blue");

    const temp_list = tempWords;
    const rng = RNG(Number(roomid));
    for (let i = 0; i < temp_list.length; i++) {
      const randomNumber = rng() * 987654321;
      const j = Math.floor(randomNumber) % temp_list.length;
      const temp = temp_list[i];
      temp_list[i] = temp_list[j];
      temp_list[j] = temp;
    }
    setShuffledWords(temp_list);
  }, [listname, roomid, wordList, turn]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--base",
      `radial-gradient(circle, ${turn == "red" ? "#e48957" : "#8fc0ef"}, ${
        turn == "red" ? "#461408" : "#113154"
      })`
    );
  }, [turn]);

  return (
    <>
      <div className="Game">
        <div className="dots"></div>
        <nav>
          <div className="navLeft">
            <Link to="/" className="Link">
              <button className="navButton">HOME</button>
            </Link>
            <h4 className={turn}>{turn.toUpperCase()} </h4>
          </div>
          <h1 className="Role">{role?.toUpperCase()}</h1>
          <div style={{ display: "flex" }}>
            <h3 className="Roomid">ID: {roomid}</h3>
            <button
              onClick={() => {
                const isMobile = window.innerWidth < 868;
                setIsFullScreen(!isFullScreen);
                if (isFullScreen) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }

                if (isMobile) {
                  if (isFullScreen) {
                    window.screen.orientation.unlock();
                  } else {
                    // @ts-expect-error - lock is not available on all browsers
                    window.screen.orientation.lock("landscape-primary");
                  }
                }
              }}
              className="fullscreen"
            >
              <img src="/KodeWords/assets/icon/fullscreen.png" />
            </button>
          </div>
        </nav>
        <div className="GameContainer">
          <div className="CardGrid">
            {shuffledWords.map((card, index) =>
              role === "spymaster" ? (
                <Card
                  key={index}
                  word={card.word}
                  type={card.type}
                  id={card.id}
                  showColor={true}
                />
              ) : (
                <Card
                  key={index}
                  id={card.id}
                  word={card.word}
                  type={card.type}
                  showColor={false}
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
