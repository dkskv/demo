import React from "react";
import { useDrag } from "../../Draggable/hooks";
import { draggableStyle } from "../../Draggable/utils";
import { useCallbackRef, useBindCallbackProp } from "../../hooks";
import { type IPressedKeys } from "../../utils/common";
import { type IPoint } from "../../utils/geometry";
import "./index.css";

interface Props<T = unknown> {
  callbackProp: T;
  onChange(callbackProp: T, origin: IPoint, pressedKeys: IPressedKeys): void;
  point: IPoint;
}

const Thumb: React.FC<Props> = ({
  callbackProp,
  onChange,
  point,
  children,
}) => {
  const handleChange = useBindCallbackProp(onChange, callbackProp);

  const [element, setRef] = useCallbackRef();

  useDrag({ element, onChange: handleChange });

  return (
    <div ref={setRef} style={draggableStyle(point)} className="Centered">
      {React.Children.only(children)}
    </div>
  );
};

export default Thumb;
