import React, { useState } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import {
  IResizeParams,
  useHighlightingOnSizeLimit,
  useResize,
  useScalableBox,
} from "./hooks";
import { resizingPointsPreset } from "../../utils/boxResize/resizingPointsPreset";
import { getBoxStyle } from "../../utils/styles";
import { Thumb } from "../Thumb";
import { useDragBox } from "../../decorators/dnd";
import { noop } from "../../utils/common";
import { SizeBounds } from "../../utils/sizeBounds";
import { Draggable } from "../Draggable";
import { OutlineHighlighting } from "../OutlineHighlighting";

export interface IResizableProps
  extends Pick<
    Partial<IResizeParams>,
    | "sizeBounds"
    | "keepAspectRatio"
    | "thumbKeys"
    | "onStart"
    | "onEnd"
    | "outerBox"
  > {
  value: BoundingBox;
  onChange: IResizeParams["onChange"];
  isDraggable?: boolean;
}

export const Resizable: React.FC<IResizableProps> = ({
  value,
  onChange,
  onStart = noop,
  onEnd = noop,
  sizeBounds = new SizeBounds(),
  outerBox = BoundingBox.infinite(),
  keepAspectRatio = false,
  thumbKeys = resizingPointsPreset.all,
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

  useScalableBox({
    box: value,
    element,
    sizeBounds,
    outerBox,
    onChange,
    onStart,
    onEnd,
    keepAspectRatio,
  });

  const thumbsProps = useResize({
    box: value,
    onChange,
    onStart,
    onEnd,
    sizeBounds,
    keepAspectRatio,
    thumbKeys,
    outerBox,
  });

  const highlightingStage = useHighlightingOnSizeLimit(value, sizeBounds);

  function renderThumbs() {
    return thumbsProps.map((thumbProps) => (
      <Draggable isCentered={true} {...thumbProps}>
        <Thumb />
      </Draggable>
    ));
  }

  return (
    <>
      <OutlineHighlighting box={value} stage={highlightingStage} size={10} />
      <div
        ref={setElement}
        style={{ ...getBoxStyle(value), position: "absolute" }}
      >
        {React.Children.only(children)}
      </div>
      <div>{renderThumbs()}</div>
    </>
  );
};
