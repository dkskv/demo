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
import {
  IResizeCallbacks,
  IResizableSettings,
  IResizeConstraints,
} from "./index.types";
import { useResizeFlag } from "./hooks/useResizeFlag";

export interface IResizableProps
  extends IResizeCallbacks,
    Partial<IResizableSettings> {
  value: BoundingBox;
  isDraggable?: boolean;
  isScalableByWheel?: boolean;
  children: React.ReactNode;
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

  const resizeConstrains: IResizeConstraints = {
    sizeLimits,
    outerBox,
    keepAspectRatio,
  };

  useWheelScalableBox({
    box: value,
    element: isScalableByWheel ? element : null,
    ...resizeConstrains,
    ...callbacks,
  });

  const handlesProps = useResizeWithHandles({
    box: value,
    handlesKeys,
    ...resizeConstrains,
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
