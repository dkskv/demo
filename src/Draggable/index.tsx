import React from "react";
import makeStateful from "../decorators/makeStateful";
import { useCallbackRef } from "../hooks";
import { Point } from "../utils/point";
import { useDrag } from "./hooks";
import "./index.css";
import { draggableStyle } from "./utils";

type IProps = React.HTMLAttributes<HTMLDivElement> & {
  value: Point;
  onChange(value: Point): void;
};

const Draggable: React.FC<IProps> = ({
  value,
  onChange,
  children,
  style,
  ...restProps
}) => {
  const [element, setRef] = useCallbackRef();

  useDrag({ element, onChange });
  
  return (
    <div
      {...restProps}
      ref={setRef}
      style={{ ...draggableStyle(value), ...style }}
    >
      {React.Children.only(children)}
    </div>
  );
};

export default makeStateful(Draggable);
