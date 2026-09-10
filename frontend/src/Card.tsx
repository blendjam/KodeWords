import { useEffect, useRef, useState } from "react";
import { CardProps, Color } from "./types/types";

const IMGPATH = "/KodeWords";

type AgentInfo = {
  count: number;
  width: number;
  height: number;
};

const AGENTS: Record<Color, AgentInfo> = {
  red: {
    count: 9,
    width: 231,
    height: 1903,
  },
  blue: {
    count: 9,
    width: 231,
    height: 1903,
  },
  gray: {
    count: 6,
    width: 231,
    height: 1267,
  },
  black: {
    count: 0,
    width: 0,
    height: 0,
  },
};

const CardNames: Record<Color, string> = {
  red: "red",
  blue: "blue",
  black: "assassin",
  gray: "neutral",
};

function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

const Card = ({ word, type, showColor, id }: CardProps) => {
  const [flipped, setFlipped] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const cardRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);

  const agent = AGENTS[type];
  const hasAgent = agent.count > 0;
  const frameIndex = hasAgent ? id % agent.count : 0;

  const fontColor = showColor && type === "black" ? "white" : "black";
  const originalType = showColor ? type : "gray";
  const cardLabel = showColor ? CardNames[type].toUpperCase() : CardNames.gray.toUpperCase();
  const cardSrc = !flipped ? `${IMGPATH}/assets/card/${originalType}.png` : `${IMGPATH}/assets/bg/${type}.png`;

  // Dynamically fit the word to the card.
  useEffect(() => {
    const card = cardRef.current;
    const wordElement = wordRef.current;

    if (!card || !wordElement) return;

    const fitText = () => {
      const cardWidth = card.clientWidth;
      const cardHeight = card.clientHeight;

      const maxWidth = cardWidth * 0.7;

      // Initial guess based on card size.
      let size = Math.min(cardWidth * 0.18, cardHeight * 0.22);

      wordElement.style.fontSize = `${size}px`;
      wordElement.style.whiteSpace = "nowrap";

      // Reduce until it fits.
      while (wordElement.scrollWidth > maxWidth && size > 8) {
        size -= 1;
        wordElement.style.fontSize = `${size}px`;
      }

      setFontSize(size);
    };
    const resizeObserver = new ResizeObserver(fitText);

    resizeObserver.observe(card);

    return () => resizeObserver.disconnect();
  }, [word]);

  return (
    <div
      ref={cardRef}
      onClick={() => setFlipped(prev => !prev)}
      className="relative h-full w-full select-none overflow-hidden">
      <img src={cardSrc} alt={`Card_${type}`} className="absolute inset-0 h-full w-full object-fill" />

      {!flipped ? (
        <>
          <h2
            className="absolute left-[40%] top-[34%] z-10 -translate-x-1/2 -translate-y-1/2 font-black leading-none text-[clamp(0.4rem,1vw,0.8rem)] text-black/50"
            style={{
              fontSize: `${fontSize / 1.5}px`,
            }}>
            {cardLabel}
          </h2>

          <div className="absolute left-1/2 top-[68%] z-10 flex h-[25%] w-[80%] -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center ">
            <h1
              ref={wordRef}
              style={{
                color: fontColor,
                fontSize: `${fontSize}px`,
              }}
              className="m-0 max-w-full whitespace-nowrap font-black leading-none">
              {capitalizeFirstLetter(word)}
            </h1>
          </div>
        </>
      ) : (
        agent.count > 0 && <Agent agent={agent} type={type} frameIndex={frameIndex} />
      )}
    </div>
  );
};

type AgentProps = {
  type: Color;
  agent: AgentInfo;
  frameIndex: number;
};

function Agent({ type, agent, frameIndex }: AgentProps) {
  return (
    <div
      className="absolute -bottom-1 left-1/2 -translate-x-1/2 overflow-hidden h-full"
      style={{
        aspectRatio: `${agent.width} / 212`,
      }}>
      <img
        src={`${IMGPATH}/assets/agent/${type}.png`}
        alt={`${type} agent`}
        className="absolute left-0 top-0 h-auto w-full max-w-none"
        style={{
          height: `${agent.count * 100} %`,
          transform: `translateY(-${(frameIndex * 100) / agent.count}%)`,
        }}
      />
    </div>
  );
}

export default Card;
