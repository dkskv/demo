import { clamp, mapObjIndexed } from "ramda";
import { IDimensions, type IPosition } from "../utils/geometry";

export const enum EOrientation {
  vertical,
  horizontal,
}

export interface ISliderRange {
  start: number; // [0, 1]
  end: number; // [0, 1]
}

function getContainerLength(
  { width, height }: IDimensions,
  orientation: EOrientation
) {
  switch (orientation) {
    case EOrientation.horizontal:
      return width;
    case EOrientation.vertical:
      return height;
  }
}

export const Converter = {
  toSliderRange(
    { x, width, y, height }: IPosition,
    containerDimensions: IDimensions,
    orientation: EOrientation
  ): ISliderRange {
    const containerLength = getContainerLength(
      containerDimensions,
      orientation
    );

    function normalize<T extends Record<string, number>>(obj: T) {
      return mapObjIndexed((a) => a / containerLength, obj) as T;
    }

    switch (orientation) {
      case EOrientation.horizontal:
        return normalize({ start: x, end: x + width});
      case EOrientation.vertical:
        return normalize({ start: y, end: y + height });
    }
  },
  toResizablePosition(
    range: ISliderRange,
    containerDimensions: IDimensions,
    orientation: EOrientation,
    thickness: number
  ): IPosition {
    const containerLength = getContainerLength(
      containerDimensions,
      orientation
    );

    const { start, end } = mapObjIndexed((a) => a * containerLength, range);
    const length = end - start;

    switch (orientation) {
      case EOrientation.horizontal:
        return { x: start, width: length, y: 0, height: thickness };
      case EOrientation.vertical:
        return { x: 0, width: thickness, y: start, height: length };
    }
  },
};

export const sliderTrackStyle = (
  { start, end }: ISliderRange,
  orientation: EOrientation,
  thickness: number
) => ({
  position: "absolute" as const,
  ...(orientation === EOrientation.horizontal
    ? {
        left: `${start * 100}%`,
        width: `${(end - start) * 100}%`,
        height: `${thickness}px`,
      } as const
    : {
        top: `${start * 100}%`,
        height: `${(end - start) * 100}%`,
        width: `${thickness}px`,
      } as const),
});

export function validateSliderRange(range: ISliderRange) {
  if (Object.entries(range).every(([, value]) => value === clamp(0, 1, value))) {
    return;
  }

  if (range.end > range.start) {
    return;
  }

  console.error(`Incorrect arg 'range': ${JSON.stringify(range)}`);
}
