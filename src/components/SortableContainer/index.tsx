import { prop, sortBy } from "ramda";
import { useCallback, useMemo, useState } from "react";
import { IDndElement, useDndConnection } from "../../decorators/dndConnection";
import { useActualRef } from "../../decorators/useActualRef";
import { BoundingBox } from "../../utils/boundingBox";
import { ISortableItem } from "./utils/sortable";
import { getBoxStyle } from "../../utils/styles";
import { DraggableBox } from "../DraggableBox";
import { SortableItemsState } from "./sortableItemsState";
import { useTemporarySet } from "./useTemporarySet";
import { useThirdPartyItemHandlers } from "./useThirdPartyItemHandlers";

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
  const [itemsState, setItemsState] = useState(
    () => new SortableItemsState(initialItems)
  );

  const [activeItem, setActiveItem] = useState<ISortableItem | null>(null);
  const [isActiveHidden, setIsActiveHidden] = useState(false);
  const droppingKeys = useTemporarySet<string>(transitionDuration);
  const actualDroppingKeys = useActualRef(droppingKeys);

  const dropActiveItem = useCallback(() => {
    setActiveItem((item) => {
      if (item) {
        actualDroppingKeys.current.add(item.key);
      }
      return null;
    });
  }, [actualDroppingKeys]);

  const actualItemsState = useActualRef(itemsState);

  const checkIsEnoughSpace = useCallback(
    (item: ISortableItem) =>
      actualItemsState.current.totalHeight + item.box.height <= box.height,
    [actualItemsState, box]
  );

  const thirdPartyItemHandlers = useThirdPartyItemHandlers({
    setActiveItem,
    dropActiveItem,
    setItemsState,
    checkIsEnoughSpace,
  });

  const { ref, onDrag, onDrop } = useDndConnection<HTMLDivElement>(
    id,
    thirdPartyItemHandlers
  );

  const handleChange = useCallback(
    (item: ISortableItem) => {
      const { isOutsideOfSource, canBeInserted } = onDrag(id, item);

      setIsActiveHidden(canBeInserted);
      setActiveItem(item);
      setItemsState((state) =>
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

      setIsActiveHidden(false);
      dropActiveItem();

      if (canBeInserted) {
        setItemsState((state) => state.removeByKey(item.key).align());
        return;
      }

      if (isOutsideOfSource) {
        setItemsState((state) =>
          state.removeByKey(item.key).insertAccordingToPosition(item)
        );
        setTimeout(() => setItemsState((state) => state.align()));
        return;
      }

      setItemsState((state) =>
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
    () => sortBy(prop("key"), itemsState.items),
    [itemsState.items]
  );

  return (
    <div
      ref={ref}
      style={{ ...getBoxStyle(box), position: "relative", ...style }}
    >
      {sortedItems.map((item) => {
        const { key, box } = item;
        const isActive = activeItem?.key === key;

        if (isActive) {
          console.log("Свой или чужой");
        }

        return (
          <DraggableBox
            key={key}
            value={isActive ? activeItem.box : box}
            onChange={(box) => handleChange({ key, box })}
            onEnd={(box) => handleEnd({ key, box })}
            style={
              isActive
                ? {
                    visibility: isActiveHidden ? "hidden" : "visible",
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
