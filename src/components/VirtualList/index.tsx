import { BoundingBox } from "../../utils/boundingBox";
import { NumbersRange } from "../../utils/numbersRange";
import { IDirection, Directions } from "../../utils/direction";
import { getBoxStyle } from "../../utils/styles";
import { getRenderingIndexes } from "./utils";

export interface IVirtualListProps {
  coordinate: number;
  viewBox: BoundingBox;
  itemSize: number;
  renderItem(index: number): React.ReactNode;
  direction?: IDirection;
}

/** Контейнер для отображения элементов */
export const VirtualList: React.FC<IVirtualListProps> = ({
  viewBox,
  itemSize,
  coordinate,
  renderItem,
  direction = Directions.horizontal,
}) => {
  const [viewRange, thicknessRange] = direction.rangesOfBox(viewBox);

  const viewAreaBounds = NumbersRange.createByDelta(coordinate, viewRange.size);
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
        const itemRange = NumbersRange.createByDelta(
          index * itemSize - coordinate,
          itemSize
        );
        const itemBox = direction.boxFromRanges(itemRange, thicknessRange);

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
