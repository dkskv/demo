import { prop, sortBy } from "ramda";
import { useCallback, useMemo, useRef, useState } from "react";
import { IDndElement, useDndConnection } from "../../decorators/dndConnection";
import { useActualRef } from "../../decorators/useActualRef";
import { useActiveSortableItem } from "../../decorators/useSortableItems";
import { BoundingBox } from "../../utils/boundingBox";
import { ISortableItem } from "../../utils/sortable/sortable";
import { getBoxStyle } from "../../utils/styles";
import { DraggableBox } from "../DraggableBox";
import { SortableItemsState } from "./utils";

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
  const [sortableItemsState, setSortableItemsState] = useState(
    () => new SortableItemsState(initialItems)
  );

  const { activeItem, setActiveItem, dropActiveItem, getOverlapIndex } =
    useActiveSortableItem(transitionDuration);
  const [isActiveHidden, setIsActiveHidden] = useState(false);

  // todo: назвать с отсылкой на остаток свободного места
  const canDropRef = useRef(false);

  const actualSortableItemsState = useActualRef(sortableItemsState);

  const handleDragIn = useCallback(
    (item: ISortableItem, isFirstEvent: boolean) => {
      if (isFirstEvent) {
        canDropRef.current =
          actualSortableItemsState.current.totalHeight + item.box.height <=
          box.height;
      }

      if (canDropRef.current) {
        setSortableItemsState((state) =>
          isFirstEvent
            ? state.insert(item).align()
            : state.relocate(item).align()
        );

        setActiveItem(item);
      }

      return { canDrop: canDropRef.current };
    },
    [setActiveItem, box, actualSortableItemsState]
  );

  const handleDropIn = useCallback(
    (item: ISortableItem) => {
      canDropRef.current && dropActiveItem(item.key);

      return { canDrop: canDropRef.current };
    },
    [dropActiveItem]
  );

  const handleDragOut = useCallback(
    (key: string) => {
      if (canDropRef.current) {
        setActiveItem(null);
        setSortableItemsState((state) => state.remove(key).align());
      }
    },
    [setActiveItem]
  );

  const { ref, onDrag, onDrop } = useDndConnection<HTMLDivElement>(id, {
    onDragIn: handleDragIn,
    onDropIn: handleDropIn,
    onDragOut: handleDragOut,
  });

  const handleChange = useCallback(
    (item: ISortableItem) => {
      const { isOutside, canDrop } = onDrag(id, item);

      setIsActiveHidden(canDrop);
      setActiveItem(item);
      setSortableItemsState((state) =>
        isOutside ? state.lower(item.key).align() : state.relocate(item).align()
      );
    },
    [id, onDrag, setActiveItem]
  );

  const handleEnd = useCallback(
    (item: ISortableItem) => {
      const { canDrop, isOutside } = onDrop(id, item);

      setIsActiveHidden(false);
      dropActiveItem(item.key);

      if (canDrop) {
        setSortableItemsState((state) => state.remove(item.key).align());
        return;
      }

      if (isOutside) {
        setSortableItemsState((state) => state.remove(item.key).insert(item));
        setTimeout(() => setSortableItemsState((state) => state.align()));
        return;
      }

      setSortableItemsState((state) => state.relocate(item).align());
    },
    [dropActiveItem, onDrop, id]
  );

  /* 
    Сохранение порядка элементов для React, чтобы получить правильную анимацию. 
    Без сортировки элементы резко меняют позицию, несмотря на CSS `transition`.
    todo: Попробовать избавиться.
  */
  const sortedItems = useMemo(
    () => sortBy(prop("key"), sortableItemsState.items),
    [sortableItemsState.items]
  );

  return (
    <div
      ref={ref}
      style={{ ...getBoxStyle(box), position: "relative", ...style }}
    >
      {sortedItems.map((item) => {
        const { key, box } = item;
        const isActive = activeItem?.key === key;

        const commonStyle = {
          zIndex: getOverlapIndex(key),
        } as const;

        return (
          <DraggableBox
            key={key}
            value={isActive ? activeItem.box : box}
            onChange={(box) => handleChange({ key, box })}
            onEnd={(box) => handleEnd({ key, box })}
            style={
              isActive
                ? {
                    ...commonStyle,
                    visibility: isActiveHidden ? "hidden" : "visible",
                  }
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
