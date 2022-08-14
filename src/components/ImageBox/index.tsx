import { BoundingBox } from "../../utils/boundingBox";
import { getBoxStyle } from "../../utils/styles";

interface IProps {
  src: string;
  box: BoundingBox;
  viewBox?: BoundingBox;
}

export const ImageBox: React.FC<IProps> = ({
  box,
  src,
  viewBox = BoundingBox.createByDimensions(0, 0, 1, 1),
}) => {
  return (
    <div
      style={{ position: "relative", overflow: "hidden", ...getBoxStyle(box) }}
    >
      <img
        alt="error"
        src={src}
        style={{
          position: "absolute",
          transform: `translate(${-viewBox.x0 * 100}%, ${-viewBox.y0 * 100}%)`,
          width: `${(1 / viewBox.dx) * 100}%`,
          height: `${(1 / viewBox.dy) * 100}%`,
        }}
      />
    </div>
  );
};
