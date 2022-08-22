import { IDirection, Directions } from "../../utils/direction";

interface IProps {
  direction?: IDirection;
  size: number;
}

export const Space: React.FC<IProps> = ({
  direction = Directions.horizontal,
  size,
  children,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction.cssValues.direction,
        [direction.cssKeys.gap]: size,
      }}
    >
      {children}
    </div>
  );
};
