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
import { useActivityFlag } from "../../decorators/useActivityFlag";

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
  const [isActive, edgeCallbacks] = useActivityFlag(onStart, onEnd);

  useDragBox({
    element: isDraggable ? element : null,
    outerBox,
    onChange,
    ...edgeCallbacks,
  });

  useScalableBox({
    box: value,
    element: isScalableByWheel ? element : null,
    sizeLimits,
    outerBox,
    onChange,
    keepAspectRatio,
    ...edgeCallbacks,
  });

  const handlesProps = useResize({
    box: value,
    onChange,
    sizeLimits,
    keepAspectRatio,
    handlesKeys,
    outerBox,
    ...edgeCallbacks,
  });

  const highlightingStage = useHighlightingOnSizeLimit(
    isActive ? value : null,
    sizeLimits
  );

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
