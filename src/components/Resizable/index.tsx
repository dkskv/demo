import React, { useCallback, useState } from "react";
import makeStateful from "../../decorators/makeStateful";
import { BoundingBox } from "../../utils/boundingBox";
import { IResizeParams, useResize } from "./hooks";
import { resizingPointsPreset } from "../../utils/boxResize/resizingPointsPreset";
import { getBoxStyle } from "../../utils/styles";
import { Thumb } from "../Thumb";
import { useDragBox } from "../../decorators/dnd";
import { useScale } from "../../decorators/useScale";
import { Point } from "../../utils/point";
import { WheelScalingK } from "../../utils/constants";
import { constrainResizedBox } from "../../utils/boxResize/constraints";

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
  onStart,
  onEnd,
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

  const handleScale = useCallback(
    (delta: number, p: Point /*, pressedKeys */) => {
      const scaledBox = value.scale(delta * WheelScalingK);

      const nextBox = constrainResizedBox(
        scaledBox,
        { sourceBox: value, transformOrigin: p },
        { aspectRatio: scaledBox.aspectRatio, outerBox, sizeBounds }
      );

      // @ts-ignore
      onChange(nextBox, {});
    },
    [value, onChange, outerBox, sizeBounds]
  );

  useScale(element, handleScale);

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
