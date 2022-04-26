import { CSSProperties } from "react";
import { BoundingBox } from "./boundingBox";
import { EBoxSide } from "./sides";
import { NumbersRange } from "./numbersRange";
import { BoxSizesBounds } from "./boxSizesBounds";

/** Интерфейс для работы компонентов в разных ориентациях */
export interface IOrientation {
  /** Возвращает диапазон крайних точек проекции на параллельную ось */
  getRangeOfBox(box: BoundingBox): NumbersRange;
  /** Возвращает диапазон крайних точек проекции на перпендикулярную ось */
  getNormalRangeOfBox(box: BoundingBox): NumbersRange;
  /** Строит бокс из заданных диапазонов */
  getBoxFromRanges(range: NumbersRange, normalRange: NumbersRange): BoundingBox;
  /** Устанавливает ограничения размеров только для параллельной оси */
  getSizeBounds(sizeRange: NumbersRange): BoxSizesBounds;
  /** Стороны бокса, перпендикулярные оси ориентации */
  sides: readonly [EBoxSide, EBoxSide];
  cssKeys: {
    length: keyof Pick<CSSProperties, "width" | "height">;
    thickness: IOrientation["cssKeys"]["length"]; 
    coordinate: keyof Pick<CSSProperties, "left" | "top" | "right" | "bottom">;
    normalCoordinate: keyof Pick<CSSProperties, "left" | "top" | "right" | "bottom">;
    gap: keyof Pick<CSSProperties, "rowGap" | "columnGap">;
  };
}

export namespace Orientations {
  export const horizontal: IOrientation = {
    getRangeOfBox(box: BoundingBox) {
      return box.xsRange;
    },
    getNormalRangeOfBox(box: BoundingBox) {
      return box.ysRange;
    },
    getBoxFromRanges(range: NumbersRange, normalRange: NumbersRange) {
      return BoundingBox.createByRanges(range, normalRange);
    },
    getSizeBounds({ start, end }: NumbersRange) {
      return BoxSizesBounds.onlyWidth(start, end);
    },
    sides: [EBoxSide.left, EBoxSide.right],
    cssKeys: {
      length: "width",
      thickness: "height",
      coordinate: "left",
      normalCoordinate: "top",
      gap: "columnGap",
    },
  };

  export const vertical: IOrientation = {
    getRangeOfBox(box: BoundingBox) {
      return box.ysRange;
    },
    getNormalRangeOfBox(box: BoundingBox) {
      return box.xsRange;
    },
    getBoxFromRanges(range: NumbersRange, normalRange: NumbersRange) {
      return BoundingBox.createByRanges(normalRange, range);
    },
    getSizeBounds({ start, end }: NumbersRange) {
      return BoxSizesBounds.onlyHeight(start, end);
    },
    sides: [EBoxSide.top, EBoxSide.bottom],
    cssKeys: {
      length: "height",
      thickness: "width",
      coordinate: "top",
      normalCoordinate: "left",
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
