import React, { useState } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import {
  IResizeParams,
  useHighlightingOnSizeLimit,
  useResize,
  useScalableBox,
} from "./hooks";
import { resizingHandlesPreset } from "../../utils/boxResize/resizingHandlesPreset";
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
    | "handlesKeys"
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
  handlesKeys = resizingHandlesPreset.all,
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

  const handlesProps = useResize({
    box: value,
    onChange,
    onStart,
    onEnd,
    sizeBounds,
    keepAspectRatio,
    handlesKeys,
    outerBox,
  });

  const highlightingStage = useHighlightingOnSizeLimit(value, sizeBounds);

  function renderHandles() {
    return handlesProps.map((handleProps) => (
      <Draggable isCentered={true} {...handleProps}>
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
      <div>{renderHandles()}</div>
    </>
  );
};
