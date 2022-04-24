import { useCallback, useMemo } from "react";
import { useDrag } from "../Draggable/hooks";
import { BoundingBox } from "../../utils/boundingBox";
import { type IPressedKeys } from "../../utils/common";
import { Point } from "../../utils/point";
import { BoxSizesBounds } from "../../utils/boxSizesBounds";
import { Draggable } from "../Draggable";
import { ResizingPoint } from "../../utils/boxResize/resizingPoint";
import { IResizeThumbKey, resizingPointsPreset } from "../../utils/boxResize/resizingPointsPreset";
import { updateBox } from "../../utils/boxResize";
import { useActualRef } from "../../decorators/useActualRef";

export interface IResizeCallbackOptions {
  pressedKeys: IPressedKeys;
  isDrag: boolean;
}

export interface IResizeParams {
  /** Текущее состояние бокса */
  box: BoundingBox;

  /** Callback, срабатывающий при намерении изменить состояние бокса */
  onChange(box: BoundingBox, options: IResizeCallbackOptions): void;

  /** Если элемент передан, то его можно перемещать */
  draggableElement: HTMLElement | null;

  /** Ограничения размера сторон */
  sizesBounds: BoxSizesBounds;

  /** Сохранять соотношении сторон */
  keepAspectRatio: boolean;

  /** Ключи отображаемых кнопок, за которые производится resize  */
  thumbKeys: readonly IResizeThumbKey[];

  /** React компонент кнопки, за которую производится resize */
  ThumbComponent: React.ComponentType<{}>;
}

export function useResize({
  box,
  draggableElement,
  onChange,
  sizesBounds,
  keepAspectRatio,
  thumbKeys,
  ThumbComponent,
}: IResizeParams): React.ReactNode {
  const boxRef = useActualRef(box);
  const keepAspectRatioRef = useActualRef(keepAspectRatio);
  const sizesBoundsRef = useActualRef(sizesBounds);

  const handleDrag = useCallback(
    (point: Point, pressedKeys: IPressedKeys) => {
      onChange(boxRef.current.moveTo(point), { pressedKeys, isDrag: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange]
  );

  useDrag({ element: draggableElement, onChange: handleDrag });
 
  const handleChangeThumb = useCallback(
    (
      resizingPoint: ResizingPoint,
      resizingPointTarget: Point,
      pressedKeys: IPressedKeys
    ) => {
      const updatedBox = updateBox({
        prevBox: boxRef.current,
        resizingPoint,
        resizingPointTarget,
        keepAspectRatio: keepAspectRatioRef.current || pressedKeys.shiftKey,
        sizesBounds: sizesBoundsRef.current
      });

      onChange(updatedBox, { pressedKeys, isDrag: false });
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange]
  )

  const resizingPoints = useMemo(() => thumbKeys.map(resizingPointsPreset.get), [thumbKeys]);

  // Кнопки располагать в одной системе координат с resizable-элементом
  return resizingPoints.map((resizingPoint, i) => {
    const key = thumbKeys[i];
   
    return (
      <Draggable
        key={String(key)}
        isCentered={true}
        value={box.denormalizePoint(resizingPoint)}
        onChange={(point, options) =>
          handleChangeThumb(resizingPoint, point, options)
        }
      >
        <ThumbComponent />
      </Draggable>
    );
  });
}
