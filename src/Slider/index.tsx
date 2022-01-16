import { useCallback, useRef, useState } from "react";
import Button from "./Thumb";
import Track from "./Track";
import { clamp, createThumbHandler } from "./utils";

interface Props {
  min: number;
  max: number;
}

const Slider: React.FC<Props> = () => {
  const [thumbPos, setThumbPos] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const { current: element } = trackRef;

  const handleCapture: React.MouseEventHandler = useCallback(
    element
      ? createThumbHandler(element, (pos: number) =>
          setThumbPos(clamp(0, 1, pos))
        )
      : () => {},
    [element]
  );

  return (
    <Track ref={trackRef}>
      <Button pos={thumbPos} onCapture={handleCapture} />
    </Track>
  );
};

export default Slider;
