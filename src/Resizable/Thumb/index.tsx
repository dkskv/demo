import { useDrag } from "../../Draggable/hooks";
import { draggableStyle } from "../../Draggable/utils";
import { useCallbackRef, useBindCallbackProp } from "../../hooks";
import { IPoint, IPressedKeys } from "../../utils";
import "./index.css";

interface Props<T = unknown> {
  callbackProp: T;
  onChange(callbackProp: T, origin: IPoint, pressedKeys: IPressedKeys): void;
  point: IPoint;
}

const Thumb: React.FC<Props> = ({ callbackProp, onChange, point }) => {
  const handleChange = useBindCallbackProp(onChange, callbackProp);

  const [element, setRef] = useCallbackRef();

  useDrag({ element, onChange: handleChange });

  return (
    <div
      ref={setRef}
      style={draggableStyle(point)}
      className="Thumb Centered"
    />
  );
};

export default Thumb;
