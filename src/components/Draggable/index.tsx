import React from "react";
import { useCallbackRef } from "../../decorators/useCallbackRef";
import { getPointStyle } from "../../utils/styles";
import { IDragCallbacks } from "../../utils/drag";
import { Point } from "../../entities/point";
import { useDrag } from "./useDrag";

interface IProps extends IDragCallbacks {
  value: Point;
  /** Относительная точка начала координат элемента*/
  origin?: Point;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const Draggable: React.FC<IProps> = ({
  value,
  onStart,
  onChange,
  onEnd,
  origin = Point.nullish,
  children,
  style,
}) => {
  const [element, setRef] = useCallbackRef();

  useDrag({ element, onStart, onChange, onEnd });

  const transform = `translate(-${origin.x * 100}%, -${origin.y * 100}%)`;

  return (
    <div
      ref={setRef}
      style={{
        ...getPointStyle(value),
        position: "absolute",
        transform,
        ...style,
      }}
    >
      {React.Children.only(children)}
    </div>
  );
};
