import { clamp, mergeAll, pick } from "ramda";
import { draggableStyle } from "../Draggable/utils";
import {
  getOrigin,
  IDimensions,
  IPoint,
  IPosition,
  mergeWithAdd,
} from "../utils";

const enum ERectangleSides {
  top = "top",
  bottom = "bottom",
  left = "left",
  right = "right",
}

// Думаю использовать имена конструкторов
const enum ERectangleCorners {
  topLeft = "topLeft",
  topRight = "topRight",
  bottomRight = "bottomRight",
  bottomLeft = "bottomLeft",
}

type ILineSegment = [IPoint, IPoint];

interface IRectangleBounds extends Record<ERectangleSides, number> {}
export interface IDimensionsBounds {
  min: IDimensions;
  max: IDimensions;
}

export const defaultDimensionsConstraints = {
  min: { width: 0, height: 0 },
  max: { width: Infinity, height: Infinity },
};

abstract class Thumb {
  public abstract getInitialPoint(dimensions: IDimensions): IPoint;

  protected abstract dependentSides: ERectangleSides[];

  public abstract clampPoint(
    currentDimensions: IDimensions,
    dimensionsConstraints: IDimensionsBounds,
    isRateably: boolean,
    point: IPoint
  ): IPoint;

  public updateRectanglePosition(
    point: IPoint,
    prevPosition: IPosition
  ): IPosition {
    const origin = getOrigin(prevPosition);

    const absolutePoint = mergeWithAdd(point, origin);
    const { x: px, y: py } = absolutePoint;

    const updatedPart = pick(this.dependentSides, {
      left: px,
      right: px,
      top: py,
      bottom: py,
    });

    return fromRectangleBounds({
      ...toRectangleBounds(prevPosition),
      ...updatedPart,
    });
  }
}

// abstract class SideThumb extends Thumb {
//   private getConstraints(
//     resizableDimensions: IDimensions,
//     { min, max }: IDimensionsBounds
//   ): IRectangleBounds {
//     // переиспользовать прямоугольник для уголков, только сделать его с нулевой шириной/высотой,
//     // находящейся в исходной позиции
//   }

//   public clampPoint(
//     currentDimensions: IDimensions,
//     dimensionsConstraints: IDimensionsBounds,
//     isRateably: boolean,
//     point: IPoint
//   ): IPoint {
//     const constraints = this.getConstraints(currentDimensions, dimensionsConstraints);

//   }
// }

export abstract class CornerThumb extends Thumb {
  private static getInitialPoint(
    dependentSides: ERectangleSides[],
    dimensions: IDimensions
  ) {
    const bounds = getRectangleBounds(dimensions);

    return mergeAll(dependentSides.map((side) => bounds[side])) as IPoint;
  }

  public getInitialPoint(dimensions: IDimensions): IPoint {
    return CornerThumb.getInitialPoint(this.dependentSides, dimensions);
  }

  private getBoundingBox(
    sidesDimensions: IDimensions,
    dimensionsBounds: IDimensionsBounds
  ) {
    const sidesBounds = getSidesBounds(sidesDimensions, dimensionsBounds);

    return mergeAll(
      this.dependentSides.map((side) => sidesBounds[side])
    ) as IRectangleBounds;
  }

  protected getCrossingDiagonal(
    dimensions: IDimensions
  ): ILineSegment {
    const oppositeSides = this.dependentSides.map(getOppositeSide);

    return [
      this.getInitialPoint(dimensions),
      CornerThumb.getInitialPoint(oppositeSides, dimensions),
    ];
  }

  public clampPoint(
    currentDimensions: IDimensions,
    dimensionsConstraints: IDimensionsBounds,
    isRateably: boolean,
    point: IPoint
  ): IPoint {
    const boundingBox = this.getBoundingBox(
      currentDimensions,
      dimensionsConstraints
    );

    const clampedPoint = clampPointWithRectangle(boundingBox, point);

    if (isRateably) {
      const diagonal = this.getCrossingDiagonal(currentDimensions);

      return clampPointWithLine(diagonal, clampedPoint);
    } else {
      return clampedPoint;
    }
  }
}

class LeftTopThumb extends CornerThumb {
  protected dependentSides = [ERectangleSides.left, ERectangleSides.top];
}

class RightTopThumb extends CornerThumb {
  protected dependentSides = [ERectangleSides.right, ERectangleSides.top];
}

class RightBottomThumb extends CornerThumb {
  protected dependentSides = [ERectangleSides.right, ERectangleSides.bottom];
}

class LeftBottomThumb extends CornerThumb {
  protected dependentSides = [ERectangleSides.left, ERectangleSides.bottom];
}

function getSidesBounds(
  sidesDimensions: IDimensions,
  dimensionsBounds: IDimensionsBounds
) {
  const { width: w, height: h } = sidesDimensions;

  const {
    min: { width: minW, height: minH },
    max: { width: maxW, height: maxH },
  } = dimensionsBounds;

  return {
    left: { left: w - maxW, right: w - minW },
    right: { left: minW, right: maxW },
    top: { top: h - maxH, bottom: h - minH },
    bottom: { top: minH, bottom: maxH },
  };
}

function getOppositeSide(side: ERectangleSides) {
  switch (side) {
    case ERectangleSides.top:
      return ERectangleSides.bottom;
    case ERectangleSides.bottom:
      return ERectangleSides.top;
    case ERectangleSides.left:
      return ERectangleSides.right;
    case ERectangleSides.right:
      return ERectangleSides.left;
  }
}

function getRectangleBounds({ width, height }: IDimensions) {
  return {
    left: { x: 0 },
    right: { x: width },
    top: { y: 0 },
    bottom: { y: height },
  };
}

function toRadiusVector(a: IPoint, b: IPoint): IPoint {
  return { x: b.x - a.x, y: b.y - a.y };
}

function dot(a: IPoint, b: IPoint): number {
  return a.x * b.x + a.y * b.y;
}

function pointProjection([a, b]: ILineSegment, c: IPoint): IPoint {
  const ac = toRadiusVector(a, c);
  const ab = toRadiusVector(a, b);

  // Коэффициент между [расстоянием от А до точки проекции] и [длиной вектора AB]
  const t = dot(ac, ab) / dot(ab, ab);

  return { x: a.x + ab.x * t, y: a.y + ab.y * t };
}

const clampPointWithLine = pointProjection;

function clampPointWithRectangle(
  constraints: IRectangleBounds,
  { x, y }: IPoint
): IPoint {
  const { left, right, top, bottom } = constraints;

  return { x: clamp(left, right, x), y: clamp(top, bottom, y) };
}

function fromRectangleBounds({
  left,
  right,
  top,
  bottom,
}: IRectangleBounds): IPosition {
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

function toRectangleBounds({
  x,
  y,
  width,
  height,
}: IPosition): IRectangleBounds {
  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
  };
}

export function getThumbs(): CornerThumb[] {
  return [
    new LeftTopThumb(),
    new RightTopThumb(),
    new RightBottomThumb(),
    new LeftBottomThumb(),
  ];
}

export function resizableStyle(position: IPosition) {
  return {
    ...draggableStyle(position),
    width: position.width,
    height: position.height,
  } as const;
}
