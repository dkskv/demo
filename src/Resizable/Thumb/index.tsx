import React from "react";
import { useDrag } from "../../Draggable/hooks";
import { draggableStyle } from "../../Draggable/utils";
import { useCallbackRef } from "../../hooks";
import { type IPressedKeys } from "../../utils/common";
import { Point } from "../../utils/point";
import "./index.css";

interface Props {
  onChange(
    point: Point,
    pressedKeys: { pressedKeys: IPressedKeys }
  ): void;
  point: Point;
}

const Thumb: React.FC<Props> = ({
  onChange,
  point,
  children,
}) => {
  const [element, setRef] = useCallbackRef();

  useDrag({ element, onChange });

  return (
    <div ref={setRef} style={draggableStyle(point)} className="Centered">
      {React.Children.only(children)}
    </div>
  );
};

export default Thumb;
