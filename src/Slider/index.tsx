import React, { useCallback, useState } from "react";
import Thumb from "./Thumb";
import Track from "./Track";
import { normalizeValues, updatePositions, handleThumbCapture } from "./utils";

interface Props {
  min: number;
  max: number;
}

const Slider: React.FC<Props> = () => {
  const initial = normalizeValues([0, 0.5]);

  const [positions, setPositions] = useState(initial);

  const [trackElement, setTrackElement] = useState<HTMLDivElement>();

  const handleCapture = useCallback(
    (i: number, event: React.MouseEvent<Element>) => {
      if (!trackElement) {
        return;
      }

      handleThumbCapture(
        event,
        trackElement,
        (p) => {
          setPositions((positions) => updatePositions(i, p, positions));
        },
      );
    },
    [trackElement]
  );

  return (
    <Track setElement={setTrackElement}>
      {positions.map((p, i) => (
        <Thumb key={i} index={i} pos={p} onCapture={handleCapture} />
      ))}
    </Track>
  );
};

export default Slider;
