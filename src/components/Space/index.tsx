import { CSSProperties, forwardRef, ReactNode } from "react";
import { IDirection, Directions } from "../../entities/direction";

interface IProps {
  direction?: IDirection;
  size: number;
  align?: CSSProperties["alignItems"];
  style?: CSSProperties;
  children: ReactNode;
}

export const Space = forwardRef<HTMLDivElement, IProps>(
  (
    { direction = Directions.horizontal, size, children, align, style },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={{
          display: "flex",
          alignItems: align,
          flexDirection: direction.cssValues.direction,
          [direction.cssKeys.gap]: size,
          ...style,
        }}
      >
        {children}
      </div>
    );
  }
);
