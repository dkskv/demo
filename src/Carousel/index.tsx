import { IOrientationAttrs, Orientations } from "../utils/orientation";
import "./index.css";
import { expandEvenly, getIndexesRange, getItemStyle, getViewAreaStyle, rangeInclusive } from "./utils";

export interface ICarouselProps {
  position: number;
  viewAreaSize: number;
  itemSize: number;
  gutter?: number;
  count: number;
  renderItem(index: number): React.ReactNode;
  orientation?: IOrientationAttrs;
}

const Carousel: React.VFC<ICarouselProps> = ({
  gutter = 0,
  viewAreaSize,
  itemSize,
  position,
  count,
  renderItem,
  orientation = Orientations.horizontal
}) => {
  const slotSize = itemSize + gutter;

  const maxPosition = slotSize * count;

  const overscanCount = 1;

  const indexes = getIndexesRange(position, viewAreaSize, slotSize);
  const expandedIndexes = expandEvenly(overscanCount, indexes);

  return (
    <div
      className="ViewArea"
      style={getViewAreaStyle(viewAreaSize, gutter, orientation)}
    >
      {rangeInclusive(expandedIndexes.start, expandedIndexes.end).map(
        (index) => (
          <div
            key={index}
            className="Item"
            style={getItemStyle(itemSize, index * slotSize - position, orientation)}
          >
            {renderItem(index)}
          </div>
        )
      )}
    </div>
  );
};

export default Carousel;
