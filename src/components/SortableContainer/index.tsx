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
  /** todo: придумать структуру, не завязанную на origin */
  const containerBox = useMemo(() => box.resetOrigin(), [box]);

  const [itemsState, setItemsState] = useState(
    () => new SortableItemsState(initialItems)
  );

  const [selfActiveItem, setSelfActiveItem] =
    useState<ISortableItem | null>(null);
  const [thirdActivePartyItem, setThirdActivePartyItem] =
    useState<ISortableItem | null>(null);
  const activeItem = selfActiveItem ?? thirdActivePartyItem;

  const [isActiveHidden, setIsActiveHidden] = useState(false);
  const droppingKeys = useTemporarySet<string>(transitionDuration);

  const actualItemsState = useActualRef(itemsState);

  const checkIsEnoughSpace = useCallback(
    (item: ISortableItem) =>
      actualItemsState.current.totalHeight + item.box.height <=
      containerBox.height,
    [actualItemsState, containerBox]
  );

  const dropThirdPartyItem = useCallback(() => {
    setThirdActivePartyItem((item) => {
      item && droppingKeys.add(item.key);
      return null;
    });
  }, [droppingKeys]);

  const thirdPartyItemHandlers = useThirdPartyItemHandlers({
    setActiveItem: setThirdActivePartyItem,
    dropActiveItem: dropThirdPartyItem,
    setItemsState,
    checkIsEnoughSpace,
  });

  const { ref, onDrag, onDrop } = useDndConnection<HTMLDivElement>(
    id,
    thirdPartyItemHandlers
  );

  const handleChange = useCallback(
    (item: ISortableItem) => {
      const { canBeInserted } = onDrag(id, item);

      setIsActiveHidden(canBeInserted);
      setSelfActiveItem(item);
      setItemsState((state) =>
        containerBox.isIntersect(item.box)
          ? state.moveIndexAccordingToPosition(item).align()
          : state.placeToBottomByKey(item.key).align()
      );
    },
    [id, onDrag, containerBox]
  );

  const handleEnd = useCallback(
    (item: ISortableItem) => {
      const { canBeInserted } = onDrop(id, item);

      setIsActiveHidden(false);
      setSelfActiveItem(null);
      droppingKeys.add(item.key);

      if (canBeInserted) {
        setItemsState((state) => state.removeByKey(item.key).align());
        return;
      }

      if (!containerBox.isIntersect(item.box)) {
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
    [droppingKeys, onDrop, id, containerBox]
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
      style={{ ...getBoxStyle(containerBox), position: "relative", ...style }}
    >
      {sortedItems.map((item) => {
        const isActive = activeItem?.key === item.key;

        return (
          <DraggableBox
            key={item.key}
            value={isActive ? activeItem.box : item.box}
            onChange={(box) => handleChange({ key: item.key, box })}
            onEnd={(box) => handleEnd({ key: item.key, box })}
            style={
              isActive
                ? {
                    cursor:
                      activeItem === thirdActivePartyItem ||
                      (activeItem === selfActiveItem &&
                        containerBox.isIntersect(selfActiveItem.box))
                        ? "move"
                        : "not-allowed",
                    visibility: isActiveHidden ? "hidden" : "visible",
                    zIndex: droppingKeys.size + 1,
                  }
                : {
                    cursor: "move",
                    transitionDuration: `${transitionDuration}ms`,
                    transitionProperty: "top left",
                    zIndex: droppingKeys.getOrder(item.key) + 1,
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
