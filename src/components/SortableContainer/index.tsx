import { prop, sortBy } from "ramda";
import { CSSProperties, useCallback, useMemo, useState } from "react";
import { useActualRef } from "../../decorators/useActualRef";
import { BoundingBox } from "../../entities/boundingBox";
import { ISortableItem } from "./utils/sortable";
import { getBoxStyle } from "../../utils/styles";
import { DraggableBox } from "../DraggableBox";
import { SortableItemsState } from "./utils/sortableItemsState";
import { useTemporarySet } from "./hooks/useTemporarySet";
import { useThirdPartyItemHandlers } from "./hooks/useThirdPartyItemHandlers";
import { useDndConnection } from "../../decorators/dndConnection/useDndConnection";
import { DndElement } from "../../decorators/dndConnection/entities/dndElement";
import { IDragBoxEvent } from "../DraggableBox/index.types";

interface IProps {
  id: string;
  box: BoundingBox;
  items: ISortableItem[];
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
  const containerBox = useMemo(() => box.resetOrigin(), [box]);

  const [itemsState, setItemsState] = useState(
    () => new SortableItemsState(initialItems)
  );

  const [overlayItem, setOverlayItem] = useState<ISortableItem | null>(null);
  const [isOverlayHidden, setIsOverlayHidden] = useState(false);
  const droppingKeys = useTemporarySet<string>(transitionDuration);

  const actualItemsState = useActualRef(itemsState);

  const { ref, onDrag, onDrop } = useDndConnection<HTMLDivElement>(id, {
    ...useThirdPartyItemHandlers({
      setOverlayItem,
      setItemsState,
    }),
    canDrop: useCallback(
      (item: ISortableItem) =>
        actualItemsState.current.totalHeight + item.box.height <=
        containerBox.height,
      [actualItemsState, containerBox]
    ),
    onDropIn: useCallback(() => {
      setOverlayItem((item) => {
        item && droppingKeys.add(item.key);
        return null;
      });
    }, [droppingKeys]),
  });

  const handleChange = useCallback(
    (key: string, { box }: IDragBoxEvent) => {
      const { canDrop } = onDrag(id, new DndElement(key, box));

      const item: ISortableItem = { key, box };
      setIsOverlayHidden(canDrop);
      setOverlayItem(item);

      setItemsState((state) =>
        containerBox.isIntersect(box)
          ? state.moveIndexAccordingToPosition(item).align()
          : state.placeToBottomByKey(key).align()
      );
    },
    [id, onDrag, containerBox]
  );

  const handleEnd = useCallback(
    (key: string, { box }: IDragBoxEvent) => {
      const { canDrop } = onDrop(id, new DndElement(key, box));

      const item: ISortableItem = { key, box };
      setIsOverlayHidden(false);
      setOverlayItem(null);
      droppingKeys.add(item.key);

      setItemsState((state) =>
        canDrop
          ? state.removeByKey(item.key).align()
          : state.moveIndexAccordingToPosition(item).align()
      );
    },
    [droppingKeys, onDrop, id]
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
        const hasOverlay = overlayItem?.key === item.key;

        const itemStyle: CSSProperties = hasOverlay
          ? {
              cursor: containerBox.isIntersect(overlayItem.box)
                ? "move"
                : "not-allowed",
              visibility: isOverlayHidden ? "hidden" : "visible",
              zIndex: droppingKeys.size + 1,
            }
          : {
              cursor: "move",
              transitionDuration: `${transitionDuration}ms`,
              transitionProperty: "top left",
              zIndex: droppingKeys.getOrder(item.key) + 1,
            };

        return (
          <DraggableBox
            key={item.key}
            value={hasOverlay ? overlayItem.box : item.box}
            onChange={(e) => handleChange(item.key, e)}
            onEnd={(e) => handleEnd(item.key, e)}
            style={itemStyle}
          >
            {renderItem(item)}
          </DraggableBox>
        );
      })}
    </div>
  );
};
