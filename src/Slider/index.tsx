import React, { useCallback, useState } from "react";
import DndItem from "../DndItem";
import { dndHandler } from "../utils/dnd";
import Thumb from "./Thumb";
import Track from "./Track";
import { normalizeValues, updatePositions } from "./utils";

interface Props {
  min: number;
  max: number;
}

const Slider: React.FC<Props> = () => {
  const minRange = 0;
  const isOverflowDisabled = false;

  const initial = normalizeValues([0, 0.5]);

  const [positions, setPositions] = useState(initial);

  const [trackElement, setTrackElement] = useState<HTMLDivElement | null>();

  const handleCapture = useCallback(
    (i: number, event: React.MouseEvent<Element>) => {
      if (!trackElement) {
        return;
      }

      dndHandler(trackElement, event, ([x]) => {
        setPositions((positions) => updatePositions(i, x, positions));
      });
    },
    [trackElement]
  );

  return (
    <Track setElement={setTrackElement}>
      {positions.map((x, i) => (
        <DndItem key={i} index={i} x={x} y={0} onCapture={handleCapture}>
          <Thumb />
        </DndItem>
      ))}
    </Track>
  );
};

export default Slider;
