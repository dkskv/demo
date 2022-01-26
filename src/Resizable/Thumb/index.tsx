import { useDrag } from "../../Draggable/hooks";
import { draggableStyle } from "../../Draggable/utils";
import { useCallbackRef, useNamedCallback } from "../../hooks";
import { IPoint } from "../../utils";
import "./index.css"

interface Props<T = string> {
  name: T;
  onChange(name: T, origin: IPoint): void;
  point: IPoint;
}

const Thumb: React.FC<Props> = ({ name, onChange, point }) => {
  const handleChange = useNamedCallback(onChange, name);

  const [element, setRef] = useCallbackRef();

  useDrag({ element, onChange: handleChange });

  return (
    <div ref={setRef} style={draggableStyle(point)} className="Thumb Centered"/>
  );
};

export default Thumb;
