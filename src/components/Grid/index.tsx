import { zipWith } from "ramda";
import { IDirection, Directions } from "../../entities/direction";
import { stretchStyle } from "../../utils/styles";
import { createDef, getMarking, IPattern } from "./utils";

interface IProps extends IPattern {
  id: string;
  color: string;
}

export const Grid: React.VFC<IProps> = ({ step, thickness, color, id }) => {
  function getPatternKey(direction: IDirection) {
    return `${id}_${direction.orientation}`;
  }

  const directions = [Directions.horizontal, Directions.vertical] as const;

  const patterns = [
    { step, thickness },
    { step, thickness },
  ] as const;

  const offset = -thickness / 2;

  return (
    <svg
      key={id}
      id={id}
      style={{
        position: "absolute",
        left: offset,
        top: offset,
        ...stretchStyle,
      }}
    >
      <defs>
        {zipWith(
          (direction, pattern) =>
            createDef(getPatternKey(direction), direction, pattern, color),
          directions,
          patterns
        )}
      </defs>
      {directions.map((direction) => getMarking(getPatternKey(direction)))}
    </svg>
  );
};
