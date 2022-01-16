import React, { useCallback } from "react";
import "./index.css";

interface Props {
  pos: number;
  index: number;
  onCapture(index: number, event: React.MouseEvent<HTMLDivElement>): void;
}

const Thumb: React.FC<Props> = ({ index, pos, onCapture }) => {
  const handleCapture: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      onCapture(index, e);
    },
    [index, onCapture]
  );

  return (
    <div
      onMouseDown={handleCapture}
      className="Thumb"
      style={{ left: `${pos * 100}%` }}
    />
  );
};

export default Thumb;
