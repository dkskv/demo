import React, { useState } from "react";
import DndArea from "../DndArea";
import DndItem from "../DndItem";
import "./index.css";

interface Props {}

const DndTest: React.FC<Props> = ({ children }) => {
  const [[x, y], setPosition] = useState([350, 350]);

  return (
    <DndArea
      className="DndTest"
      onPositionChange={(name, pos) => name === "lol" && setPosition(pos)}
    >
      <DndItem name="lol" x={x} y={y}>
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
      {children}
    </DndArea>
  );
};

export default DndTest;
