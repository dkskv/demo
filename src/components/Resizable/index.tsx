import React from "react";
import makeStateful from "../../decorators/makeStateful";
import { useCallbackRef } from "../../hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { IPressedKeys } from "../../utils/common";
import { BoxSizesBounds } from "../../utils/boxSizesBounds";
import { IResizeCallbackOptions, useResize } from "./hooks";
import { allThumbKeys } from "../../utils/boxResize";
import { getBoxStyle } from "../../utils/dom";
import { Thumb } from "../Thumb";

type IProps = React.HTMLAttributes<HTMLDivElement> & {
  value: BoundingBox;
  onChange(value: BoundingBox, options: IResizeCallbackOptions): void;
  sizesBounds?: BoxSizesBounds;
};

const Resizable: React.FC<IProps> = ({
  value,
  onChange,
  sizesBounds = BoxSizesBounds.without(),
  children,
  style,
  ...restProps
}) => {
  const [element, setRef] = useCallbackRef();

  const thumbsElements = useResize({
    box: value,
    draggableElement: element,
    onChange,
    sizesBounds,
    onlyRateably: false,
    thumbKeys: allThumbKeys,
    thumbComponent: Thumb,
  });

  return (
    <div
      {...restProps}
      ref={setRef}
      style={{ ...getBoxStyle(value), position: "absolute", ...style }}
    >
      {React.Children.only(children)}
      {thumbsElements}
    </div>
  );
};

export default makeStateful(Resizable);
