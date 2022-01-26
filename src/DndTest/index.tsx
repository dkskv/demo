import React from "react";
import "./index.css";
import "../index.css";
import Draggable from "../Draggable";
import Resizable from "../Resizable";

interface Props {}

const DndTest: React.FC<Props> = () => {
  return (
    <div className="DndTest">
      <Draggable initialPoint={{ left: 300, top: 300 }}>
        <div className="Thumb" />
      </Draggable>
      <Resizable
        initialPosition={{ left: 50, top: 60, width: 150, height: 150 }}
      >
        <div className="Resizable" />
      </Resizable>
    </div>
  );
};

export default DndTest;
