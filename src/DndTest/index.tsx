import React from "react";
import "./index.css";
import "../index.css";
import Draggable from "../Draggable";
import Resizable from "../Resizable";

interface Props {}

const DndTest: React.FC<Props> = () => {
  return (
    <div className="DndTest">
      <Draggable initialPoint={{ x: 300, y: 300 }}>
        <div className="Thumb" />
      </Draggable>
      <Resizable
        initialPosition={{ x: 50, y: 60, width: 150, height: 150 }}
      >
        <div className="Resizable" />
      </Resizable>
    </div>
  );
};

export default DndTest;
