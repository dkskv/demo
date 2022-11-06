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
import { useWheelScalableBox } from "./hooks/useWheelScalableBox";
import { useHighlightingOnSizeLimit } from "./hooks/useHighlightingOnSizeLimit";
import { IResizeCallbacks, IResizeConstraints } from "./index.types";
import { useResizeFlag } from "./hooks/useResizeFlag";
import { IResizeHandleKey } from "./utils/resizingHandlesPreset";

export interface IResizableProps
  extends IResizeCallbacks,
    Partial<IResizeConstraints> {
  value: BoundingBox;
  isDraggable?: boolean;
  isScalableByWheel?: boolean;
  children: React.ReactNode;
  /** Ключи отображаемых кнопок, за которые производится resize  */
  handlesKeys?: readonly IResizeHandleKey[];
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
  const callbacks = { onChange, onStart, onEnd };

  useDragBox({
    element: isDraggable ? element : null,
    outerBox,
    ...callbacks,
  });

  const constraints: IResizeConstraints = {
    sizeLimits,
    outerBox,
    keepAspectRatio,
  };

  useWheelScalableBox({
    box: value,
    element: isScalableByWheel ? element : null,
    constraints,
    ...callbacks,
  });

  const handlesProps = useResizeWithHandles({
    box: value,
    handlesKeys,
    constraints,
    ...callbacks,
  });

  const isOuterBoxResized = useResizeFlag(outerBox);

  const highlightingStage = useHighlightingOnSizeLimit(
    isOuterBoxResized ? null : value,
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
