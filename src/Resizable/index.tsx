import React from "react";
import { useState } from "react";
import { useCallbackRef } from "../hooks";
import { IPosition } from "../utils";
import { useResize } from "./hooks";
import { resizableStyle } from "./utils";

interface IProps {
  initialPosition: IPosition;
}

const Resizable: React.FC<IProps> = ({ initialPosition, children }) => {
  const [element, setRef] = useCallbackRef();

  const [position, setPosition] = useState(initialPosition);

  const { thumbs } = useResize({ element, position, onChange: setPosition });

  const child = React.Children.only(children);

  return (
    <div ref={setRef} style={resizableStyle(position)}>
      {child}
      {thumbs}
    </div>
  );
};

export default Resizable;
