import "./Card.css";
import { CardProps } from "../types/types";
import React, { useEffect, useReducer, useState } from "react";
import { IMGPATH } from "./Linker";

const Card = ({ word, type, clickable, id }: CardProps) => {
  const [cardType, setCardType] = useState(type);
  const [cardImage, setCardImage] = useState(IMGPATH + "/assets/card/gray.png");
  const [click, setClick] = useState(false);

  useEffect(() => {
    let card_type = clickable ? "gray" : type;
    setCardImage(`${IMGPATH}/assets/card/${card_type}.png`);
    card_type = card_type == "black" ? "assassian" : card_type;
    card_type = card_type == "gray" ? "neutral" : card_type;
    setCardType(card_type);
  }, [type]);

  const onCardClick = () => {
    if (clickable) {
      setClick(!click);
      // transform: rotatex(55deg) translatez(42px);
      const cardSrc = click ? `${IMGPATH}/assets/card/gray.png` : `${IMGPATH}/assets/bg/${type}.png`;
      setCardImage(cardSrc);
    }
  };

  const fontColor = !clickable && type == "black" ? "white" : "black";
  const totalAgents = type == "gray" ? 5 : 8;
  const offsetFactor = 100 / totalAgents;
  return (
    <div
      className="Card"
      style={{ cursor: clickable ? "pointer" : "default" }}
      onClick={onCardClick}
    >
      <img src={cardImage} alt={`Card_${type}`} className="CardImage" />
      {!click ? (
        <>
          <h2 className="CardType">{cardType.toUpperCase()}</h2>
          <h1 className="CardWord" style={{ color: fontColor }}>
            {word}
          </h1>
        </>
      ) : (
        <div style={{ backgroundImage: `url(${IMGPATH}/assets/agent/${type}.png)`, backgroundPositionY: `${(Number(id) % totalAgents) * offsetFactor}%` }} className="CardAgent" />
      )}
    </div>
  );
};

export default Card;
