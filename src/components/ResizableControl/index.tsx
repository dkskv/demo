import React, { useCallback, useMemo, useState } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { IPressedKeys, noop } from "../../utils/common";
import { getOffsetBox } from "../../utils/dom";
import Resizable, { IResizableProps } from "../Resizable";
import { denormalizeSizeBounds } from "./utils";

export interface IResizableControlProps
  extends Omit<IResizableProps, "callbackRef" | "outerBox"> {}

/** Resizable элемент, представленный в нормализованном виде */
const ResizableControl: React.FC<IResizableControlProps> = ({
  value,
  onChange,
  onStart = noop,
  onEnd = noop,
  sizeBounds = {},
  ...rest
}) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  /** Бокс, по которому производится нормализация */
  const outerBox = useMemo(
    () => (element ? getOffsetBox(element) : BoundingBox.infinite()),
    [element]
  );

  const handleChange = useNormalizedCallback(onChange, outerBox);
  const handleStart = useNormalizedCallback(onStart, outerBox);
  const handleEnd = useNormalizedCallback(onEnd, outerBox);

  return (
    <Resizable
      {...rest}
      callbackRef={setElement}
      outerBox={outerBox}
      value={outerBox.denormalizeInner(value)}
      onChange={handleChange}
      onStart={handleStart}
      onEnd={handleEnd}
      sizeBounds={denormalizeSizeBounds(sizeBounds, outerBox)}
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

export default ResizableControl;
