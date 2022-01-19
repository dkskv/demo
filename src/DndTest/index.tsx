import React, { useCallback, useState } from "react";
import DndItem from "../DndItem";
import { dndHandler } from "../utils/dnd";
import "./index.css";

interface Props {}

const DndTest: React.FC<Props> = () => {
  const [[x, y], setPosition] = useState([0.5, 0.5]);

  const [areaElement, setAreaElement] = useState<HTMLDivElement | null>();

  const handleCapture = useCallback(
    (i: number, event: React.MouseEvent<Element>) => {
      if (!areaElement) {
        return;
      }

      dndHandler(areaElement, event, setPosition);
    },
    [areaElement]
  );

  return (
    <div className="DndTest" ref={(ref) => setAreaElement(ref)}>
      <DndItem onCapture={handleCapture} index={1} x={x} y={y}>
        <div
          style={{
            backgroundColor: "blueviolet",
            height: "40px",
            width: "40px",
          }}
        />
      </DndItem>
    </div>
  );
};

export default DndTest;
