import React from "react";
import makeStateful from "../../decorators/makeStateful";
import { useCallbackRef } from "../../hooks";
import { getPointStyle } from "../../utils/styles";
import { IDragCallback } from "../../utils/drag";
import { Point } from "../../utils/point";
import { useDrag } from "./hooks";
import "./index.css";

type IProps = {
  value: Point;
  onChange: IDragCallback;
  /** Установить origin элемента в центр */
  isCentered?: boolean;
};

export const Draggable: React.FC<IProps> = ({
  value,
  onChange,
  isCentered = false,
  children,
}) => {
  const [element, setRef] = useCallbackRef();

  useDrag({ element, onChange });

  const transform = isCentered ? "translate(-50%, -50%)" : undefined;

  return (
    <div
      ref={setRef}
      style={{ ...getPointStyle(value), position: "absolute", transform }}
    >
      {React.Children.only(children)}
    </div>
  );
};

export const StatefulDraggable = makeStateful(Draggable);
