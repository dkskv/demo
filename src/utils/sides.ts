export const enum EBoxSide {
  top = "top",
  bottom = "bottom",
  left = "left",
  right = "right",
}

export const horizontalSides = [EBoxSide.left, EBoxSide.right] as const;
export const verticalSides = [EBoxSide.top, EBoxSide.bottom] as const;







