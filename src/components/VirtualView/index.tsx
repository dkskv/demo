import { useEffect } from "react";
import { BoundingBox } from "../../utils/boundingBox";
import { noop } from "../../utils/common";
import { NumbersRange } from "../../utils/numbersRange";
import { IOrientation, Orientations } from "../../utils/orientation";
import { getBoxStyle } from "../../utils/styles";
import { getRenderingIndexes } from "./utils";

export interface IVirtualViewProps {
  coordinate: number;
  viewBox: BoundingBox;
  itemSize: number;
  gutter: number;
  count: number;
  renderItem(index: number): React.ReactNode;
  orientation?: IOrientation;
  /** Оповещение об изменении диапазона допустимых координат */
  onBoundsChange?(bounds: NumbersRange): void;
}

/** Карусель для отображения элементов */
export const VirtualView: React.FC<IVirtualViewProps> = ({
  gutter = 0,
  viewBox,
  itemSize,
  coordinate,
  count,
  renderItem,
  orientation = Orientations.horizontal,
  onBoundsChange = noop,
}) => {
  const [viewRange, thicknessRange] = orientation.rangesOfBox(viewBox);

  const slotSize = itemSize + gutter;
  const maxCoordinate = slotSize * count - viewRange.size;

  useEffect(() => {
    onBoundsChange(new NumbersRange(0, maxCoordinate));
  }, [onBoundsChange, maxCoordinate]);

  const viewAreaBounds = NumbersRange.createBySize(coordinate, viewRange.size);
  const indexes = getRenderingIndexes(viewAreaBounds, slotSize, 1);

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
          index * slotSize - coordinate,
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
