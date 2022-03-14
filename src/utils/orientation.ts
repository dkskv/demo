import { CSSProperties } from "react";
import { EBoxSide, EDimension, EPointCoordinate } from "./geometry";

export interface IOrientationAttrs {
  length: EDimension;
  thickness: EDimension;

  coordinate: EPointCoordinate;
  fixedCoordinate: EPointCoordinate;

  startSide: EBoxSide;
  endSide: EBoxSide;

  css: {
    length: keyof Pick<CSSProperties, "width" | "height">;
    thickness: IOrientationAttrs["css"]["length"];
    coordinate: keyof Pick<CSSProperties, "left" | "top" | "right" | "bottom">;
    gap: keyof Pick<CSSProperties, "rowGap" | "columnGap">
  };
}

const horizontal: IOrientationAttrs = {
  length: EDimension.width,
  thickness: EDimension.height,
  coordinate: EPointCoordinate.x,
  fixedCoordinate: EPointCoordinate.y,
  startSide: EBoxSide.left,
  endSide: EBoxSide.right,
  css: {
    length: "width",
    thickness: "height",
    coordinate: "left",
    gap: "columnGap"
  },
};

const horizontalReverse: IOrientationAttrs = {
  ...horizontal,
  startSide: horizontal.endSide,
  endSide: horizontal.startSide,
  css: {
    ...horizontal.css,
    coordinate: "right",
  },
};

const vertical: IOrientationAttrs = {
  length: EDimension.height,
  thickness: EDimension.width,
  coordinate: EPointCoordinate.y,
  fixedCoordinate: EPointCoordinate.x,
  startSide: EBoxSide.top,
  endSide: EBoxSide.bottom,
  css: {
    length: "height",
    thickness: "width",
    coordinate: "top",
    gap: "rowGap"
  },
};

const verticalReverse: IOrientationAttrs = {
  ...vertical,
  startSide: vertical.endSide,
  endSide: vertical.startSide,
  css: {
    ...vertical.css,
    coordinate: "bottom",
  },
};

export const Orientations = {
  horizontal,
  horizontalReverse,
  vertical,
  verticalReverse,
};
