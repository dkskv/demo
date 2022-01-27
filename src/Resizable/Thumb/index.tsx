import { useDrag } from "../../Draggable/hooks";
import { draggableStyle } from "../../Draggable/utils";
import { useCallbackRef, useNamedCallback } from "../../hooks";
import { IPoint } from "../../utils";
import "./index.css"

interface Props<T = unknown> {
  callbackProps: T;
  onChange(name: T, origin: IPoint): void;
  point: IPoint;
}

const Thumb: React.FC<Props> = ({ callbackProps, onChange, point }) => {
  // todo: переименовать хук
  const handleChange = useNamedCallback(onChange, callbackProps);

  const [element, setRef] = useCallbackRef();

  useDrag({ element, onChange: handleChange });

  return (
    <div ref={setRef} style={draggableStyle(point)} className="Thumb Centered"/>
  );
};

export default Thumb;
