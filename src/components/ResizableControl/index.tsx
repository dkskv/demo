import React, { useCallback } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { IPressedKeys, noop } from "../../utils/common";
import { SizeLimits } from "../../utils/sizeLimits";
import { Resizable, IResizableProps } from "../Resizable";

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
  callback: (box: BoundingBox, pressedKeys: IPressedKeys) => void,
  outerBox: BoundingBox
) {
  return useCallback<typeof callback>(
    (box, pressedKeys) => {
      callback(outerBox.normalizeInner(box), pressedKeys);
    },
    [callback, outerBox]
  );
}
