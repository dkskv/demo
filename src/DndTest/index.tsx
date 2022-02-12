import React from "react";
import "./index.css";
import "../index.css";
import Draggable from "../Draggable";
import Resizable from "../Resizable";
import makeStateful from "../decorators/makeStateful";

interface Props {}

const DndTest: React.FC<Props> = () => {
  const StatefulDraggable = makeStateful(Draggable);
  const StatefulResizable = makeStateful(Resizable);

  return (
    <div className="DndTest">
      <StatefulDraggable initialValue={{ x: 300, y: 300 }}>
        <div className="Thumb" />
      </StatefulDraggable>
      <StatefulResizable initialValue={{ x: 50, y: 60, width: 200, height: 150 }}>
        <div className="Resizable" />
      </StatefulResizable>
    </div>
  );
};

export default DndTest;
