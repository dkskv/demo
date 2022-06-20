import { useCallback } from "react";
import { useActualRef } from "../../decorators/useActualRef";
import { BoundingBox } from "../../utils/boundingBox";
import { IPressedKeys } from "../../utils/common";
import { getBoxOnPage } from "../../utils/dom";
import { IDragCallbacks } from "../../utils/drag";
import { IDragParams, useDrag } from "../Draggable/hooks";

interface IDragBoxParams extends Omit<IDragParams, "onChange"> {
  onChange(box: BoundingBox, pressedKeys: IPressedKeys): void;
  /** Внешний бокс, в чьих пределах может перемещаться данный */
  outerBox?: BoundingBox;
}

/**
 * useDrag с измененным типом onChange: передает бокс вместо точки.
 * todo: вынести из Resizable.
 */
export function useDragBox(params: IDragBoxParams) {
  const { element, onChange } = params;
  const paramsRef = useActualRef(params);

  const handleChange: IDragCallbacks["onChange"] = useCallback(
    (point, pressedKeys) => {
      const { outerBox } = paramsRef.current;
      const box = getBoxOnPage(element!).moveTo(point);

      onChange(outerBox ? outerBox.clampInner(box) : box, pressedKeys);
    },
    [element, onChange, paramsRef]
  );

  return useDrag({ ...params, onChange: handleChange });
}
