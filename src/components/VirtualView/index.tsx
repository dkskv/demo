import { BoundingBox } from "../../utils/boundingBox";
import { NumbersRange } from "../../utils/numbersRange";
import { IOrientation, Orientations } from "../../utils/orientation";
import { getBoxStyle } from "../../utils/styles";
import { getRenderingIndexes } from "./utils";

export interface IVirtualViewProps {
  coordinate: number;
  viewBox: BoundingBox;
  itemSize: number;
  renderItem(index: number): React.ReactNode;
  orientation?: IOrientation;
}

/** Карусель для отображения элементов */
export const VirtualView: React.FC<IVirtualViewProps> = ({
  viewBox,
  itemSize,
  coordinate,
  renderItem,
  orientation = Orientations.horizontal,
}) => {
  const [viewRange, thicknessRange] = orientation.rangesOfBox(viewBox);

  const viewAreaBounds = NumbersRange.createBySize(coordinate, viewRange.size);
  const indexes = getRenderingIndexes(viewAreaBounds, itemSize, 1);

  return (
    <div
      style={{
        ...getBoxStyle(viewBox),
        overflow: "hidden",
        position: "relative",
      }}
    >
      {indexes.map((index) => {
        const itemRange = NumbersRange.createBySize(
          index * itemSize - coordinate,
          itemSize
        );
        const itemBox = orientation.boxFromRanges(itemRange, thicknessRange);

        return (
          <div
            key={index}
            style={{ position: "absolute", ...getBoxStyle(itemBox) }}
          >
            {renderItem(index)}
          </div>
        );
      })}
    </div>
  );
};
