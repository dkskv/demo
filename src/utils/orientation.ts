import { CSSProperties } from "react";
import { BoundingBox } from "./boundingBox";
import { EBoxSide, horizontalSides, verticalSides } from "./sides";
import { Range } from "./range";
import { SizesConstraints } from "./sizesConstraints";
import { Constraints } from "./constraints";

/**
 * Интерфейс для поворота компонентов, работающих в одной плоскости.
 */
export interface IOrientation {
  /** Возвращает диапазон крайних точек проекции на соответствующую ось */
  getRangeOfBox(box: BoundingBox): Range;
  /** Строит бокс из заданных диапазонов */
  getBoxFromRanges(range: Range, normalRange: Range): BoundingBox;
  /** Устанавливает ограничения размеров только для параллельной оси */
  getSizeConstraints(c: Constraints): SizesConstraints;
  /** Стороны бокса, перпендикулярные оси ориентации */
  sides: readonly [EBoxSide, EBoxSide];
  cssKeys: {
    length: keyof Pick<CSSProperties, "width" | "height">;
    thickness: IOrientation["cssKeys"]["length"];
    coordinate: keyof Pick<CSSProperties, "left" | "top" | "right" | "bottom">;
    gap: keyof Pick<CSSProperties, "rowGap" | "columnGap">;
  };
}

export namespace Orientations {
  export const horizontal: IOrientation = {
    getRangeOfBox(box: BoundingBox) {
      return box.xsRange;
    },
    getBoxFromRanges(range: Range, normalRange: Range) {
      return BoundingBox.createByRanges(range, normalRange);
    },
    getSizeConstraints({ min, max }: Constraints) {
      return SizesConstraints.onlyWidth(min, max);
    },
    sides: horizontalSides,
    cssKeys: {
      length: "width",
      thickness: "height",
      coordinate: "left",
      gap: "columnGap",
    },
  };

  export const vertical: IOrientation = {
    getRangeOfBox(box: BoundingBox) {
      return box.ysRange;
    },
    getBoxFromRanges(range: Range, normalRange: Range) {
      return BoundingBox.createByRanges(normalRange, range);
    },
    getSizeConstraints({ min, max }: Constraints) {
      return SizesConstraints.onlyHeight(min, max);
    },
    sides: verticalSides,
    cssKeys: {
      length: "height",
      thickness: "width",
      coordinate: "top",
      gap: "rowGap",
    },
  };

  /*
  export const horizontalReverse: IOrientation = {
    ...horizontal,
    cssKeys: {
      ...horizontal.cssKeys,
      coordinate: "right",
    },
  };

  export const verticalReverse: IOrientation = {
    ...vertical,
    cssKeys: {
      ...vertical.cssKeys,
      coordinate: "bottom",
    },
  };
  */
}
