import React from "react";
import "./index.css";
import "../index.css";
import Draggable from "../Draggable";
import Resizable from "../Resizable";

const DndTest = () => {
  return (
    <div className="DndTest">
      <Draggable initialValue={{ x: 300, y: 300 }}>
        <div className="Thumb" />
      </Draggable>
      <Resizable initialValue={{ x: 50, y: 60, width: 200, height: 150 }}>
        <div className="Resizable" />
      </Resizable>
    </div>
  );
};

export default DndTest;
