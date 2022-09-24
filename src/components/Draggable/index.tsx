import React from "react";
import { useCallbackRef } from "../../decorators/useCallbackRef";
import { getPointStyle } from "../../utils/styles";
import { IDragCallbacks } from "../../utils/drag";
import { Point } from "../../utils/point";
import { useDrag } from "../../decorators/dnd";
import "./index.css";

interface IProps extends Partial<IDragCallbacks> {
  value: Point;
  onChange: IDragCallbacks["onChange"];
  /** Установить origin элемента в центр */
  isCentered?: boolean;

  style?: React.CSSProperties;
}

export const Draggable: React.FC<IProps> = ({
  value,
  onStart,
  onChange,
  onEnd,
  isCentered = false,
  children,
  style,
}) => {
  const [element, setRef] = useCallbackRef();

  useDrag({ element, onStart, onChange, onEnd });

  const transform = isCentered ? "translate(-50%, -50%)" : undefined;

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
