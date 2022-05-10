import React, { useCallback, useMemo, useState } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { IPressedKeys } from "../../utils/common";
import { getOffsetBox } from "../../utils/domElement";
import Resizable, { IResizableProps } from "../Resizable";
import { denormalizeSizeBounds } from "./utils";

export interface IResizableControlProps
  extends Omit<IResizableProps, "callbackRef" | "outerBox"> {}

/** Resizable элемент, представленный в нормализованном виде */
const ResizableControl: React.FC<IResizableControlProps> = ({
  value,
  onChange,
  sizeBounds = {},
  ...rest
}) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  /** Бокс, по которому производится нормализация */
  const outerBox = useMemo(
    () => (element ? getOffsetBox(element) : BoundingBox.infinite()),
    [element]
  );

  const handleChange = useCallback(
    (box: BoundingBox, pressedKeys: IPressedKeys) => {
      onChange(outerBox.normalizeInner(box), pressedKeys);
    },
    [onChange, outerBox]
  );

  return (
    <Resizable
      {...rest}
      callbackRef={setElement}
      outerBox={outerBox}
      value={outerBox.denormalizeInner(value)}
      onChange={handleChange}
      sizeBounds={denormalizeSizeBounds(sizeBounds, outerBox)}
    />
  );
};

export default ResizableControl;
