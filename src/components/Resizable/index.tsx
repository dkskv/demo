import React, { useState } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import {
  IResizeParams,
  useHighlightingOnSizeLimit,
  useResize,
  useScalableBox,
} from "./hooks";
import { resizingHandlesPreset } from "./utils/resizingHandlesPreset";
import { getBoxStyle } from "../../utils/styles";
import { Thumb } from "../Thumb";
import { useDragBox } from "../../decorators/dnd";
import { noop } from "../../utils/common";
import { SizeLimits } from "../../utils/sizeLimits";
import { Draggable } from "../Draggable";
import { OutlineHighlighting } from "../OutlineHighlighting";

export interface IResizableProps
  extends Pick<
    Partial<IResizeParams>,
    | "sizeLimits"
    | "keepAspectRatio"
    | "handlesKeys"
    | "onStart"
    | "onEnd"
    | "outerBox"
  > {
  value: BoundingBox;
  onChange: IResizeParams["onChange"];
  isDraggable?: boolean;
  isScalableByWheel?: boolean;
}

export const Resizable: React.FC<IResizableProps> = ({
  value,
  onChange,
  onStart = noop,
  onEnd = noop,
  sizeLimits = new SizeLimits(),
  outerBox = BoundingBox.infinite(),
  keepAspectRatio = false,
  handlesKeys = resizingHandlesPreset.all,
  isDraggable = true,
  isScalableByWheel = true,
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
    element: isScalableByWheel ? element : null,
    sizeLimits,
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
    sizeLimits,
    keepAspectRatio,
    handlesKeys,
    outerBox,
  });

  const highlightingStage = useHighlightingOnSizeLimit(value, sizeLimits);

  function renderHandles() {
    return handlesProps.map((handleProps) => (
      <Draggable isCentered={true} {...handleProps}>
        <Thumb />
      </Draggable>
    ));
  }

  const displayedValue = value.sortAscCoordinates();

  return (
    <>
      <OutlineHighlighting
        box={displayedValue}
        stage={highlightingStage}
        size={10}
      />
      <div
        ref={setElement}
        style={{
          ...getBoxStyle(displayedValue),
          position: "absolute",
        }}
      >
        {React.Children.only(children)}
      </div>
      <div>{renderHandles()}</div>
    </>
  );
};
