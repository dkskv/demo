import { IOrientation, Orientations } from "../../utils/orientation";

interface IProps {
  orientation?: IOrientation;
  size: number;
}

export const Space: React.FC<IProps> = ({
  orientation = Orientations.horizontal,
  size,
  children,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: orientation.cssValues.direction,
        [orientation.cssKeys.gap]: size,
      }}
    >
      {children}
    </div>
  );
};
