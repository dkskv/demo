import React, { useCallback, useState } from "react";
import DndItem from "../DndItem";
import { createDndAreaHandler } from "./utils";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Props extends Omit<DivProps, "ref" | "onMouseDown"> {
  onPositionChange(name: string, position: [number, number]): void;
}

const DndArea: React.FC<Props> = ({
  children,
  onPositionChange,
  ...restProps
}) => {
  const [element, setElement] = useState<HTMLDivElement | null>();

  const handleCapture: React.MouseEventHandler<HTMLDivElement> = useCallback(
    createDndAreaHandler(element!, `.${DndItem.className}`, onPositionChange),
    [onPositionChange, element]
  );

  return (
    <div
      onMouseDown={handleCapture}
      ref={setElement}
      style={{ position: "relative" }}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default DndArea;
