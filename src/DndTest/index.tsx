import React from "react";
import "./index.css";
import "../index.css";
import Draggable from "../Draggable";
import Resizable from "../Resizable";
import makeStateful from "../decorators/makeStateful";

interface Props {}

const DndTest: React.FC<Props> = () => {
  const SDraggable = makeStateful(Draggable);
  const SResizable = makeStateful(Resizable);


  return (
    <div className="DndTest">
      
      <SDraggable initialValue={{ x: 300, y: 300 }}>
        <div className="Thumb" />
      </SDraggable>
      <SResizable initialValue={{ x: 50, y: 60, width: 200, height: 150 }}>
        <div className="Resizable" />
      </SResizable>
    </div>
  );
};

export default DndTest;
