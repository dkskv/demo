import React from "react";
import { useState } from "react";
import { useCallbackRef } from "../hooks";
import { IPosition } from "../utils/geometry";
import { useResize } from "./hooks";
import { resizableStyle } from "./utils";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  initialPosition: IPosition;
}

const Resizable: React.FC<IProps> = ({ initialPosition, children, ...restProps }) => {
  const [element, setRef] = useCallbackRef();

  const [position, setPosition] = useState(initialPosition);

  const { thumbs } = useResize({ element, position, onChange: setPosition });

  return (
    <div {...restProps} ref={setRef} style={resizableStyle(position)}>
      {React.Children.only(children)}
      {thumbs}
    </div>
  );
};

export default Resizable;
