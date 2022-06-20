import React from "react";
import { useCallbackRef } from "../../hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { IPressedKeys } from "../../utils/common";
import { IDragCallbacks } from "../../utils/drag";
import { getBoxStyle } from "../../utils/styles";
import { useDragBox } from "../Resizable/hooks";

interface IProps extends Partial<Pick<IDragCallbacks, "onStart" | "onEnd">> {
  value: BoundingBox;
  onChange(box: BoundingBox, pressedKeys: IPressedKeys): void;
  style?: React.CSSProperties;
}

export const DraggableBox: React.FC<IProps> = ({
  value,
  onChange,
  onStart,
  onEnd,
  children,
  style,
}) => {
  const [element, setRef] = useCallbackRef();

  useDragBox({ element, onChange, onStart, onEnd });

  return (
    <div
      ref={setRef}
      style={{ ...getBoxStyle(value), position: "absolute", ...style }}
    >
      {React.Children.only(children)}
    </div>
  );
};
