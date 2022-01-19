import React, { useCallback } from "react";
import "./index.css";

interface Props {
  x: number;
  y: number;
  index: number;
  onCapture(index: number, event: React.MouseEvent<HTMLDivElement>): void;
}

const DndItem: React.FC<Props> = ({ index, x, y, onCapture, children }) => {
  const handleCapture: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      onCapture(index, e);
    },
    [index, onCapture]
  );

  return (
    <div
      onMouseDown={handleCapture}
      className="DndItem"
      style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
    >
      {children}
    </div>
  );
};

export default DndItem;
