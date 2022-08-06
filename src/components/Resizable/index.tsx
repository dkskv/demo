import React, { useState } from "react";
import makeStateful from "../../decorators/makeStateful";
import { BoundingBox } from "../../utils/boundingBox";
import { IResizeParams, useResize } from "./hooks";
import { resizingPointsPreset } from "../../utils/boxResize/resizingPointsPreset";
import { getBoxStyle } from "../../utils/styles";
import { Thumb } from "../Thumb";
import { useDragBox } from "../../decorators/dnd";

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
}

const Resizable: React.FC<IResizableProps> = ({
  value,
  onChange,
  onStart,
  onEnd,
  sizeBounds = {},
  outerBox = BoundingBox.infinite(),
  keepAspectRatio = false,
  thumbKeys = resizingPointsPreset.all,
  ThumbComponent = Thumb,
  children,
}) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useDragBox({ element, outerBox, onChange, onStart, onEnd });

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
