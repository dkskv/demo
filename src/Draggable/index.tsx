import React, { useState } from "react";
import { useCallbackRef } from "../hooks";
import { type IPoint } from "../utils/geometry";
import { useDrag } from "./hooks";
import "./index.css";
import { draggableStyle } from "./utils";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  initialPoint: IPoint;
}

const Draggable: React.FC<IProps> = ({ initialPoint, children, ...restProps }) => {
  const [element, setRef] = useCallbackRef();

  const [point, setPoint] = useState(initialPoint);

  useDrag({ element, onChange: setPoint });

  const child = React.Children.only(children);

  return (
    <div {...restProps} ref={setRef} style={draggableStyle(point)} >
      {child}
    </div>
  );
};

export default Draggable;
