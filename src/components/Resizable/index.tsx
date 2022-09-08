import React, { useState } from "react";
import makeStateful from "../../decorators/makeStateful";
import { BoundingBox } from "../../utils/boundingBox";
import { IResizeParams, useResize, useScalableBox } from "./hooks";
import { resizingPointsPreset } from "../../utils/boxResize/resizingPointsPreset";
import { getBoxStyle } from "../../utils/styles";
import { Thumb } from "../Thumb";
import { useDragBox } from "../../decorators/dnd";
import { noop } from "../../utils/common";

export interface IResizableProps
  extends Pick<
    Partial<IResizeParams>,
    | "sizeBounds"
    | "keepAspectRatio"
    | "thumbKeys"
    | "ThumbComponent"
    | "onStart"
    | "onEnd"
    | "outerBox"
  > {
  value: BoundingBox;
  onChange: IResizeParams["onChange"];
  isDraggable?: boolean;
}

const Resizable: React.FC<IResizableProps> = ({
  value,
  onChange,
  onStart = noop,
  onEnd = noop,
  sizeBounds = {},
  outerBox = BoundingBox.infinite(),
  keepAspectRatio = false,
  thumbKeys = resizingPointsPreset.all,
  ThumbComponent = Thumb,
  isDraggable = true,
  children,
}) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useDragBox({
    element: isDraggable ? element : null,
    outerBox,
    onChange,
    onStart,
    onEnd,
  });

  const thumbsElements = useResize({
    box: value,
    onChange,
    onStart,
    onEnd,
    sizeBounds,
    keepAspectRatio,
    thumbKeys,
    outerBox,
    ThumbComponent,
  });

  useScalableBox({
    box: value,
    element: isDraggable ? element : null,
    sizeBounds,
    outerBox,
    onChange,
    onStart,
    onEnd,
  });

  return (
    <>
      <div
        ref={setElement}
        style={{ ...getBoxStyle(value), position: "absolute" }}
      >
        {React.Children.only(children)}
      </div>
      {thumbsElements}
    </>
  );
};

export default makeStateful(Resizable);
