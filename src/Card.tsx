import "./Card.css";
import { CardProps } from "../types/types";
import React, { useEffect, useReducer, useState } from "react";

const IMGPATH = "/KodeWords";

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const Card = ({ word, type, showColor, id }: CardProps) => {
  const [flipped, setFlipped] = useState(false);

  const fontColor = showColor && type == "black" ? "white" : "black";
  const totalAgents = type == "gray" ? 5 : 8;
  const offsetFactor = 100 / totalAgents;

  const originalType = showColor ? type : "gray";
  let card_type = !flipped ? "gray" : originalType;
  card_type = card_type == "black" ? "assassin" : card_type;
  card_type = card_type == "gray" ? "neutral" : card_type;

  const cardSrc = !flipped ? `${IMGPATH}/assets/card/${originalType}.png` : `${IMGPATH}/assets/bg/${type}.png`;

  return (
    <div
      className="Card"
      onClick={() => {
        setFlipped(prev => !prev);
      }}>
      <img src={cardSrc} alt={`Card_${type}`} className="CardImage" />
      {!flipped ? (
        <>
          <h2 className="CardType">{card_type.toUpperCase()}</h2>
          <div className="WordContainer">
            <h1 className="CardWord" style={{ color: fontColor }}>
              {capitalizeFirstLetter(word)}
            </h1>
          </div>
        </>
      ) : (
        <div style={{ backgroundImage: `url(${IMGPATH}/assets/agent/${type}.png)`, backgroundPositionY: `${(Number(id) % totalAgents) * offsetFactor}%` }} className="CardAgent" />
      )}
    </div>
  );
};

export default Card;
