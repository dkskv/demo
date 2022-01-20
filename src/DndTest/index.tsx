import React, { useState } from "react";
import DndArea from "../DndArea";
import DndItem from "../DndItem";
import "./index.css";

interface Props {}

const DndTest: React.FC<Props> = () => {
  const [[x, y], setPosition] = useState([50, 50]);

  return (
    <DndArea
      className="DndTest"
      onPositionChange={(_, pos) => setPosition(pos)}
    >
      <DndItem name={"lol"} x={x} y={y}>
        <div
          style={{
            backgroundColor: "blueviolet",
            height: "40px",
            width: "40px",
          }}
        >
          Lol
        </div>
      </DndItem>
    </DndArea>
  );
};

export default DndTest;
