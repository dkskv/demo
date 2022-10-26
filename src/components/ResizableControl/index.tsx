import React, { useCallback } from "react";
import { BoundingBox } from "../../entities/boundingBox";
import { noop } from "../../utils/common";
import { SizeLimits } from "../../entities/sizeLimits";
import { Resizable, IResizableProps } from "../Resizable";
import { IResizeCallback } from "../Resizable/index.types";

export interface IResizableControlProps extends IResizableProps {
  outerBox: NonNullable<IResizableProps["outerBox"]>;
}

/** Resizable элемент, представленный в нормализованном виде */
export const ResizableControl: React.FC<IResizableControlProps> = ({
  value,
  onChange,
  onStart = noop,
  onEnd = noop,
  sizeLimits = new SizeLimits(),
  outerBox,
  ...rest
}) => {
  const handleChange = useNormalizedCallback(onChange, outerBox);
  const handleStart = useNormalizedCallback(onStart, outerBox);
  const handleEnd = useNormalizedCallback(onEnd, outerBox);

  return (
    <Resizable
      {...rest}
      value={outerBox.denormalizeInner(value)}
      onChange={handleChange}
      onStart={handleStart}
      onEnd={handleEnd}
      sizeLimits={sizeLimits.denormalize(outerBox.dx, outerBox.dy)}
      outerBox={outerBox}
    />
  );
};

function useNormalizedCallback(
  callback: IResizeCallback,
  outerBox: BoundingBox
) {
  return useCallback<IResizeCallback>(
    (event) => callback({ ...event, box: outerBox.normalizeInner(event.box) }),
    [callback, outerBox]
  );
}
