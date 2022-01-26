import React, { useState } from "react";
import Draggable from "../Draggable";
import { normalizeValues, updatePositions } from "./utils";
import "./index.css";
import Thumb from "./Thumb";

interface Props {
  min: number;
  max: number;
}

const Slider: React.FC<Props> = () => {
  const minRange = 0;
  const isOverflowDisabled = false;

  const [positions, setPositions] = useState([0, 50]);

  
  return null;
  // return (
  //   <DndArea
  //     onPositionChange={(name, [x]) => {
  //       setPositions((positions) =>
  //         updatePositions(Number(name), x, positions)
  //       );
  //     }}
  //     className="Track"
  //   >
  //     {positions.map((x, i) => (
  //       <DndItem key={i} name={String(i)} x={x} y={0}>
  //         <Thumb />
  //       </DndItem>
  //     ))}
  //   </DndArea>
  // );
};

export default Slider;
