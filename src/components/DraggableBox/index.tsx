import React from "react";
import { useCallbackRef } from "../../decorators/useCallbackRef";
import { BoundingBox } from "../../entities/boundingBox";
import { getBoxStyle } from "../../utils/styles";
import { IDragBoxCallbacks } from "./index.types";
import { useDragBox } from "./useDragBox";

interface IProps extends IDragBoxCallbacks {
  value: BoundingBox;
  style?: React.CSSProperties;
}

export const DraggableBox: React.FC<IProps> = ({
  value,
  children,
  style,
  ...rest
}) => {
  const [element, setRef] = useCallbackRef();

  useDragBox({ element, ...rest });

  return (
    <div
      ref={setRef}
      style={{ ...getBoxStyle(value), position: "absolute", ...style }}
    >
      {React.Children.only(children)}
    </div>
  );
};
