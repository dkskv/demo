import { useCallback, useState } from "react";
import Button from "./Thumb";
import Track from "./Track";
import { clamp, createThumbHandler } from "./utils";

interface Props {
  min: number;
  max: number;
}

const Slider: React.FC<Props> = () => {
  const [thumbPos, setThumbPos] = useState(0);

  const [element, setElement] = useState<HTMLDivElement>();

  const handleCapture: React.MouseEventHandler = useCallback(
    element
      ? createThumbHandler(element, (pos: number) =>
          setThumbPos(clamp(0, 1, pos))
        )
      : () => {},
    [element]
  );

  return (
    <Track setElement={setElement}>
      <Button pos={thumbPos} onCapture={handleCapture} />
    </Track>
  );
};

export default Slider;
