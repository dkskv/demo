import { BoundingBox } from "../../utils/boundingBox";
import { getBoxStyle, stretchStyle } from "../../utils/styles";

interface IProps {
  src: string;
  box: BoundingBox;
  viewBox?: BoundingBox;
}

export const ImageBox: React.FC<IProps> = ({ box, src, viewBox }) => {
  return (
    <div style={{ position: "relative", ...getBoxStyle(box) }}>
      <img alt="error" src={src} style={stretchStyle} />
    </div>
  );
};
