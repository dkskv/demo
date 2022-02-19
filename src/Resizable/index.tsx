import React from "react";
import makeStateful from "../decorators/makeStateful";
import { useCallbackRef } from "../hooks";
import { IPressedKeys } from "../utils/common";
import { IPosition } from "../utils/geometry";
import { useResize } from "./hooks";
import { IThumbKey, resizableStyle } from "./utils";

type IProps = React.HTMLAttributes<HTMLDivElement> & {
  value: IPosition;
  onChange(
    value: IPosition,
    options: { pressedKeys: IPressedKeys; thumbKey: IThumbKey }
  ): void;
};

const Resizable: React.FC<IProps> = ({
  value,
  onChange,
  children,
  style,
  ...restProps
}) => {
  const [element, setRef] = useCallbackRef();

  const { thumbs } = useResize({ element, position: value, onChange });

  return (
    <div
      {...restProps}
      ref={setRef}
      style={{ ...resizableStyle(value), ...style }}
    >
      {React.Children.only(children)}
      {thumbs}
    </div>
  );
};

export default makeStateful(Resizable);
