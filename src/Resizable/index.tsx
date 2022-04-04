import React from "react";
import makeStateful from "../decorators/makeStateful";
import { useCallbackRef } from "../hooks";
import { BoundingBox } from "../utils/boundingBox";
import { IPressedKeys } from "../utils/common";
import { SizesConstraints } from "../utils/sizesConstraints";
import { useResize } from "./hooks";
import { IThumbKey, resizableStyle } from "./utils";

type IProps = React.HTMLAttributes<HTMLDivElement> & {
  value: BoundingBox;
  onChange(
    value: BoundingBox,
    options: { pressedKeys: IPressedKeys; thumbKey: IThumbKey }
  ): void;
  sizesConstraints?: SizesConstraints;
};

const Resizable: React.FC<IProps> = ({
  value,
  onChange,
  sizesConstraints = SizesConstraints.without(),
  children,
  style,
  ...restProps
}) => {
  const [element, setRef] = useCallbackRef();

  const thumbsElements = useResize({ element, box: value, onChange, sizesConstraints });

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
