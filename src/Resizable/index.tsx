import { compose } from "ramda";
import React, { useCallback, useState } from "react";
import DndArea from "../DndArea";
import DndItem from "../DndItem";
import "./index.css";
import { IState } from "./index.types";
import { createStateUpdater, getAreaStyle, getThumbs } from "./utils";

interface Props {}

const style = {
  backgroundColor: "blueviolet",
  height: "40px",
  width: "40px",
};

const Resizable: React.FC<Props> = () => {
  const [state, setState] = useState<IState>([50, 50, 150, 150]);

  const handleResize = useCallback(compose(setState, createStateUpdater), []);

  return (
    <DndArea
      className="Resizable"
      onPositionChange={handleResize}
      style={getAreaStyle(state)}
    >
      {getThumbs(state).map(({ name, position: [x, y] }) => (
        <DndItem key={name} name={name} x={x} y={y}>
          <div style={style}>{name}</div>
        </DndItem>
      ))}
    </DndArea>
  );
};

export default Resizable;
