import React, { useState } from "react";
import { BoundingBox } from "../../entities/boundingBox";
import { useResizeWithHandles } from "./hooks/useResizeWithHandles";
import { getBoxStyle } from "../../utils/styles";
import { Thumb } from "../Thumb";
import { useDragBox } from "../DraggableBox/useDragBox";
import { noop } from "../../utils/common";
import { SizeLimits } from "../../entities/sizeLimits";
import { Draggable } from "../Draggable";
import { OutlineHighlighting } from "../OutlineHighlighting";
import { useActivityFlag } from "../../decorators/useActivityFlag";
import { useWheelScalableBox } from "./hooks/useWheelScalableBox";
import { useHighlightingOnSizeLimit } from "./hooks/useHighlightingOnSizeLimit";
import { IResizeCallbacks, IResizableSettings } from "./index.types";

export interface IResizableProps
  extends IResizeCallbacks,
    Partial<IResizableSettings> {
  value: BoundingBox;
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
  handlesKeys,
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

  useWheelScalableBox({
    box: value,
    element: isScalableByWheel ? element : null,
    sizeLimits,
    outerBox,
    onChange,
    keepAspectRatio,
    ...edgeCallbacks,
  });

  const handlesProps = useResizeWithHandles({
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
      <div>
        {handlesProps.map((handleProps) => (
          <Draggable {...handleProps}>
            <Thumb />
          </Draggable>
        ))}
      </div>
    </>
  );
};
