import { prop, sortBy } from "ramda";
import { useCallback, useMemo, useRef, useState } from "react";
import { IDndElement, useDndConnection } from "../../decorators/dndConnection";
import { useActualRef } from "../../decorators/useActualRef";
import { BoundingBox } from "../../utils/boundingBox";
import { ISortableItem } from "./utils/sortable";
import { getBoxStyle } from "../../utils/styles";
import { DraggableBox } from "../DraggableBox";
import { SortableItemsState } from "./sortableItemsState";
import { useTemporarySet } from "./useTemporarySet";

interface IProps {
  id: string;
  box: BoundingBox;
  items: IDndElement[];
  transitionDuration?: number;
  style?: React.CSSProperties;
  renderItem(item: ISortableItem): React.ReactNode;
}

export const SortableContainer: React.FC<IProps> = ({
  id,
  box,
  items: initialItems,
  transitionDuration = 0,
  style,
  renderItem,
}) => {
  const [sortableItemsState, setSortableItemsState] = useState(
    () => new SortableItemsState(initialItems)
  );

  const [activeItem, setActiveItem] = useState<ISortableItem | null>(null);
  const droppingKeys = useTemporarySet<string>(transitionDuration);
  const actualDroppingKeys = useActualRef(droppingKeys);

  const [beingAcceptingByForeign, setBeingAcceptingByForeign] = useState(false);
  const beingAcceptingFromForeign = useRef(false);

  const actualSortableItemsState = useActualRef(sortableItemsState);

  const dropActiveItem = useCallback(() => {
    setActiveItem((item) => {
      if (item) {
        actualDroppingKeys.current.add(item.key);
      }
      return null;
    });
  }, [actualDroppingKeys]);

  const handleForeignItemDragIn = useCallback(
    (item: ISortableItem, isFirstEvent: boolean) => {
      if (isFirstEvent) {
        const isEnoughSpace =
          actualSortableItemsState.current.totalHeight + item.box.height <=
          box.height;

        beingAcceptingFromForeign.current = isEnoughSpace;
      }

      if (beingAcceptingFromForeign.current) {
        setSortableItemsState((state) =>
          isFirstEvent
            ? state.insertAccordingToPosition(item).align()
            : state.moveIndexAccordingToPosition(item).align()
        );

        setActiveItem(item);
      }

      return { canBeInserted: beingAcceptingFromForeign.current };
    },
    [setActiveItem, box, actualSortableItemsState]
  );

  const handleForeignItemDropIn = useCallback(() => {
    if (beingAcceptingFromForeign.current) {
      dropActiveItem();
    }

    return { canBeInserted: beingAcceptingFromForeign.current };
  }, [dropActiveItem]);

  const handleForeignItemDragOut = useCallback(
    (key: string) => {
      if (beingAcceptingFromForeign.current) {
        beingAcceptingFromForeign.current = false;
        setActiveItem(null);
        setSortableItemsState((state) => state.removeByKey(key).align());
      }
    },
    [setActiveItem]
  );

  const { ref, onDrag, onDrop } = useDndConnection<HTMLDivElement>(id, {
    onDragIn: handleForeignItemDragIn,
    onDropIn: handleForeignItemDropIn,
    onDragOut: handleForeignItemDragOut,
  });

  const handleChange = useCallback(
    (item: ISortableItem) => {
      const { isOutsideOfSource, canBeInserted } = onDrag(id, item);

      setBeingAcceptingByForeign(canBeInserted);
      setActiveItem(item);
      setSortableItemsState((state) =>
        isOutsideOfSource
          ? state.placeToBottomByKey(item.key).align()
          : state.moveIndexAccordingToPosition(item).align()
      );
    },
    [id, onDrag, setActiveItem]
  );

  const handleEnd = useCallback(
    (item: ISortableItem) => {
      const { canBeInserted, isOutsideOfSource } = onDrop(id, item);

      setBeingAcceptingByForeign(false);
      dropActiveItem();

      if (canBeInserted) {
        setSortableItemsState((state) => state.removeByKey(item.key).align());
        return;
      }

      if (isOutsideOfSource) {
        setSortableItemsState((state) =>
          state.removeByKey(item.key).insertAccordingToPosition(item)
        );
        setTimeout(() => setSortableItemsState((state) => state.align()));
        return;
      }

      setSortableItemsState((state) =>
        state.moveIndexAccordingToPosition(item).align()
      );
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

        return (
          <DraggableBox
            key={key}
            value={isActive ? activeItem.box : box}
            onChange={(box) => handleChange({ key, box })}
            onEnd={(box) => handleEnd({ key, box })}
            style={
              isActive
                ? {
                    visibility: beingAcceptingByForeign ? "hidden" : "visible",
                    zIndex: droppingKeys.size + 1,
                  }
                : {
                    transitionDuration: `${transitionDuration}ms`,
                    transitionProperty: "top left",
                    zIndex: droppingKeys.getOrder(key) + 1,
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
