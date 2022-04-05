import React from "react";
import makeStateful from "../decorators/makeStateful";
import { useCallbackRef } from "../hooks";
import { BoundingBox } from "../utils/boundingBox";
import { IPressedKeys } from "../utils/common";
import { BoxSizesBounds } from "../utils/boxSizesBounds";
import { useResize } from "./hooks";
import { allThumbKeys, IThumbKey, resizableStyle } from "./utils";

type IProps = React.HTMLAttributes<HTMLDivElement> & {
  value: BoundingBox;
  onChange(
    value: BoundingBox,
    options: { pressedKeys: IPressedKeys; thumbKey: IThumbKey }
  ): void;
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
    element,
    box: value,
    onChange,
    sizesBounds,
    isDrag: true,
    onlyRateably: false,
    thumbKeys: allThumbKeys
  });

  return (
    <div
      {...restProps}
      ref={setRef}
      style={{ ...resizableStyle(value), ...style }}
    >
      {React.Children.only(children)}
      {thumbsElements}
    </div>
  );
};

export default makeStateful(Resizable);
