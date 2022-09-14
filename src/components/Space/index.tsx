import { CSSProperties } from "react";
import { IDirection, Directions } from "../../utils/direction";

interface IProps {
  direction?: IDirection;
  size: number;
  align?: CSSProperties["alignItems"];
}

export const Space: React.FC<IProps> = ({
  direction = Directions.horizontal,
  size,
  children,
  align,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: align,
        flexDirection: direction.cssValues.direction,
        [direction.cssKeys.gap]: size,
      }}
    >
      {children}
    </div>
  );
};
