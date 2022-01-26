import React, { useState } from "react";
import { useCallbackRef } from "../hooks";
import { IPoint } from "../utils";
import { useDrag } from "./hooks";
import "./index.css";
import { draggableStyle } from "./utils";

interface IProps {
  initialPoint: IPoint;
}

const Draggable: React.FC<IProps> = ({ initialPoint, children }) => {
  const [element, setRef] = useCallbackRef();

  const [point, setPoint] = useState(initialPoint);

  useDrag({ element, onChange: setPoint });

  const child = React.Children.only(children);

  return (
    <div ref={setRef} style={draggableStyle(point)}>
      {child}
    </div>
  );
};

export default Draggable;