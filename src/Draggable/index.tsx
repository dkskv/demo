import React from "react";
import { useCallbackRef } from "../hooks";
import { type IPoint } from "../utils/geometry";
import { useDrag } from "./hooks";
import "./index.css";
import { draggableStyle } from "./utils";

type IProps = React.HTMLAttributes<HTMLDivElement> & {
  value: IPoint;
  onChange(value: IPoint): void;
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

export default Draggable;
