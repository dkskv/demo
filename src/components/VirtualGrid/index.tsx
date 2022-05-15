import { BoundingBox } from "../../utils/boundingBox";
import { Orientations } from "../../utils/orientation";
import { Point } from "../../utils/point";
import { VirtualList } from "../VirtualList";

interface IVirtualGridProps {
  coordinates: Point;
  dx: number;
  dy: number;
  viewBox: BoundingBox;
  renderItem(rowIndex: number, columnIndex: number): React.ReactNode;
}

/** Контейнер для отображения элементов */
export const VirtualGrid: React.FC<IVirtualGridProps> = ({
  viewBox,
  dx,
  dy,
  coordinates,
  renderItem,
}) => {
  const rowBox = BoundingBox.createByDimensions(0, 0, viewBox.dx, dy);

  return (
    <VirtualList
      orientation={Orientations.vertical}
      viewBox={viewBox}
      coordinate={coordinates.y}
      itemSize={dy}
      renderItem={(rowIndex) => (
        <VirtualList
          orientation={Orientations.horizontal}
          viewBox={rowBox}
          coordinate={coordinates.x}
          itemSize={dx}
          renderItem={(columnIndex) => renderItem(rowIndex, columnIndex)}
        />
      )}
    />
  );
};
