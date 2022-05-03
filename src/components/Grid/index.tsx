import { zipWith } from "ramda";
import { IOrientation, Orientations } from "../../utils/orientation";
import { stretchStyle } from "../../utils/styles";
import { createDef, getMarking, IPattern } from "./utils";

interface IProps extends IPattern {
  id: string;
  color: string;
}

export const Grid: React.VFC<IProps> = ({ step, thickness, color, id }) => {
  function getPatternKey(orientation: IOrientation) {
    return `${id}_${orientation.key}`;
  }

  const orientations = [
    Orientations.horizontal,
    Orientations.vertical,
  ] as const;

  const patterns = [
    { step, thickness },
    { step, thickness },
  ] as const;

  return (
    <svg key={id} id={id} style={stretchStyle}>
      <defs>
        {zipWith(
          (orientation, pattern) =>
            createDef(getPatternKey(orientation), orientation, pattern, color),
          orientations,
          patterns
        )}
      </defs>
      {orientations.map((orientation) =>
        getMarking(getPatternKey(orientation))
      )}
    </svg>
  );
};
