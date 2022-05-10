import { CSSProperties } from "react";
import { BoundingBox } from "./boundingBox";
import { EBoxLength, EBoxSide } from "./boxParams";
import { NumbersRange } from "./numbersRange";

export const enum EOrientation {
  horizontal = "horizontal",
  vertical = "vertical",
}

/** Интерфейс для работы компонентов в разных ориентациях */
export interface IOrientation {
  key: EOrientation;
  /** Возвращает диапазоны (параллельный и перпендикулярный) из переданного бокса */
  rangesOfBox(box: BoundingBox): [NumbersRange, NumbersRange];
  /** Строит бокс из заданных диапазонов (параллельного и перпендикулярного) */
  boxFromRanges(
    parallelRange: NumbersRange,
    normalRange: NumbersRange
  ): BoundingBox;
  lengthKey: EBoxLength,
  /** Стороны бокса, перпендикулярные оси ориентации */
  sides: readonly [EBoxSide, EBoxSide];
  /** @deprecated */
  cssKeys: {
    length: keyof Pick<CSSProperties, "width" | "height">;
    thickness: IOrientation["cssKeys"]["length"];
    coordinate: keyof Pick<CSSProperties, "left" | "top" | "right" | "bottom">;
    normalCoordinate: keyof Pick<
      CSSProperties,
      "left" | "top" | "right" | "bottom"
    >;
  };
}

export namespace Orientations {
  export const horizontal: IOrientation = {
    key: EOrientation.horizontal,
    rangesOfBox(box: BoundingBox) {
      return [box.xsRange, box.ysRange];
    },
    boxFromRanges(parallelRange: NumbersRange, normalRange: NumbersRange) {
      return BoundingBox.createByRanges(parallelRange, normalRange);
    },
    lengthKey: EBoxLength.width,
    sides: [EBoxSide.left, EBoxSide.right],
    cssKeys: {
      length: "width",
      thickness: "height",
      coordinate: "left",
      normalCoordinate: "top",
    },
  };

  export const vertical: IOrientation = {
    key: EOrientation.vertical,
    rangesOfBox(box: BoundingBox) {
      return [box.ysRange, box.xsRange];
    },
    boxFromRanges(parallelRange: NumbersRange, normalRange: NumbersRange) {
      return BoundingBox.createByRanges(normalRange, parallelRange);
    },
    lengthKey: EBoxLength.height,
    sides: [EBoxSide.top, EBoxSide.bottom],
    cssKeys: {
      length: "height",
      thickness: "width",
      coordinate: "top",
      normalCoordinate: "left",
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
