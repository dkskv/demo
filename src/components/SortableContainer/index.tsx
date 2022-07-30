import { prop, sortBy } from "ramda";
import { useCallback, useMemo } from "react";
import {
  IDndElement,
  responseFromVoid,
  useDndConnection,
} from "../../decorators/dndConnection";
import {
  useActiveSortableItem,
  useSortableItems,
} from "../../decorators/useSortableItems";
import { BoundingBox } from "../../utils/boundingBox";
import { ISortableItem } from "../../utils/sortable/sortable";
import { getBoxStyle } from "../../utils/styles";
import { DraggableBox } from "../DraggableBox";

interface IProps {
  id: string;

  box: BoundingBox;
  items: IDndElement[];
  /** Время анимации в ms */
  transitionDuration?: number;
  style?: React.CSSProperties;

  /** Item renderer */
  children(item: ISortableItem): React.ReactNode;
}

export const SortableContainer: React.FC<IProps> = ({
  id,
  box,
  items: initialItems,
  transitionDuration = 0,
  style,
  children: renderItem,
}) => {
  const [items, manager] = useSortableItems(initialItems);

  const { activeItem, setActiveItem, successfullyDrop, getOverlapIndex } =
    useActiveSortableItem(transitionDuration);

  const handleDragIn = useCallback(
    (item: ISortableItem) => {
      setActiveItem(item);

      manager.has(item.key) ? manager.relocate(item) : manager.insert(item);
      manager.align();

      return responseFromVoid;
    },
    [manager, setActiveItem]
  );

  const handleDropIn = useCallback(
    (item: ISortableItem) => {
      successfullyDrop(item.key);

      return { canDrop: true };
    },
    [successfullyDrop]
  );

  const handleDragOut = useCallback(
    (key: string) => {
      setActiveItem(null);

      manager.remove(key);
      manager.align();
    },
    [manager, setActiveItem]
  );

  const { ref, onDrag, onDrop } = useDndConnection<HTMLDivElement>(id, {
    onDragIn: handleDragIn,
    onDropIn: handleDropIn,
    onDragOut: handleDragOut,
  });

  const handleChange = useCallback(
    (item: ISortableItem) => {
      const { isOutside } = onDrag(id, item);

      setActiveItem(item);

      isOutside ? manager.lower(item.key) : manager.relocate(item);
      manager.align();
    },
    [id, onDrag, manager, setActiveItem]
  );

  const handleEnd = useCallback(
    (item: ISortableItem) => {
      const { canDrop, isOutside } = onDrop(id, item);

      successfullyDrop(item.key);

      if (canDrop) {
        manager.remove(item.key);
        manager.align();
        return;
      }

      if (isOutside) {
        manager.remove(item.key);
        manager.insert(item);

        setTimeout(() => manager.align());
        return;
      }

      manager.relocate(item);
      manager.align();
    },
    [successfullyDrop, onDrop, id, manager]
  );

  /* 
    Сохранение порядка элементов для React, чтобы получить правильную анимацию. 
    Без сортировки элементы резко меняют позицию, несмотря на CSS `transition`.
    todo: Попробовать избавиться.
  */
  const sortedItems = useMemo(() => sortBy(prop("key"), items), [items]);

  return (
    <div
      ref={ref}
      style={{ ...getBoxStyle(box), position: "relative", ...style }}
    >
      {sortedItems.map((item) => {
        const { key, box } = item;
        const isActive = activeItem?.key === key;
        const commonStyle = { zIndex: getOverlapIndex(key) };

        return (
          <DraggableBox
            key={key}
            value={isActive ? activeItem.box : box}
            onChange={(box) => handleChange({ key, box })}
            onEnd={(box) => handleEnd({ key, box })}
            style={
              isActive
                ? commonStyle
                : {
                    ...commonStyle,
                    transitionDuration: `${transitionDuration}ms`,
                    transitionProperty: "top left",
                  }
            }
          >
            {renderItem(item)}
          </DraggableBox>
        );
      })}
    </div>
  );
};
