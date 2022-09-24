import { useTheme } from "../../decorators/theme";
import { IDirection } from "../../utils/direction";
import { NumbersRange } from "../../utils/numbersRange";
import { getBoxStyle } from "../../utils/styles";

interface IProps {
  thickness: number;
  length: number;
  direction: IDirection;
  viewPort: NumbersRange;
  isActive: boolean;
}

export const Scrollbar: React.FC<IProps> = ({
  direction,
  length,
  thickness,
  viewPort,
  isActive,
}) => {
  const box = direction.boxFromRanges(
    NumbersRange.byOnlyDelta(length),
    NumbersRange.byOnlyDelta(thickness)
  );

  const thumbBox = direction.boxFromRanges(
    viewPort.map((n) => n * length),
    NumbersRange.byOnlyDelta(thickness)
  );

  const theme = useTheme();

  return (
    <div
      style={{
        ...getBoxStyle(box),
        position: "relative",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          ...getBoxStyle(thumbBox),
          background: theme.scrollColor,
          transitionProperty: "opacity",
          transitionDuration: "500ms",
          borderRadius: theme.smallBorderRadius,
          border: `1px solid ${theme.strokeColor}`,
          boxSizing: "border-box",
          opacity: isActive ? 1 : 0,
        }}
      />
    </div>
  );
};
