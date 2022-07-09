import React from "react";
import { useCallbackRef } from "../../hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { IPressedKeys } from "../../utils/common";
import { getBoxStyle } from "../../utils/styles";
import { IDragParams } from "../Draggable/hooks";
import { useDragBox } from "./hooks";

interface IProps
  extends Partial<
    Pick<IDragParams, "onStart" | "onEnd" | "isInOwnCoordinates">
  > {
  value: BoundingBox;
  onChange(box: BoundingBox, pressedKeys: IPressedKeys): void;
  style?: React.CSSProperties;
}

export const DraggableBox: React.FC<IProps> = ({
  value,
  onChange,
  onStart,
  onEnd,
  isInOwnCoordinates,
  children,
  style,
}) => {
  const [element, setRef] = useCallbackRef();

  useDragBox({ element, onChange, onStart, onEnd, isInOwnCoordinates });

  return (
    <div
      ref={setRef}
      style={{ ...getBoxStyle(value), position: "absolute", ...style }}
    >
      {React.Children.only(children)}
    </div>
  );
};
