import React from "react";
import { useCallbackRef } from "../../hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { getBoxStyle } from "../../utils/styles";
import { IDragBoxParams, useDragBox } from "../../decorators/dnd";
interface IProps extends Partial<IDragBoxParams> {
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
